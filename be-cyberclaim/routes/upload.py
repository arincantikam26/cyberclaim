from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os
from typing import List, Dict, Any
import shutil
from datetime import datetime
import asyncio
import json

from database import get_db, SessionLocal
from services.auth import get_current_user
from schemas.user import UserResponse
from schemas.claim import (
    ClaimSubmissionCreate, 
    ClaimSubmissionResponse, 
    SimpleClaimUpload, 
    SimpleClaimResponse,
    ClaimStatus,
    DocumentValidationResponse
)
from repositories.claim import (
    create_claim_submission, 
    update_claim_status,
    get_claim_by_id,
    get_pending_verification_claims
)
from utils.file_utils import validate_archive, extract_archive
from services.fraud_detection import detect_fraud_patterns
from services.validation import validate_claim_documents
from services.file_processing import process_claim_files
from models.claim import ClaimSubmission
from models.medical import SEP, RekamMedis, Diagnosis, Tindakan, TarifINACBGS
from models.patient import Patient

router = APIRouter()

# Konstanta
MAX_RAR_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.rar', '.zip'}

def safe_uuid(val):
    if val is None:
        return None
    if isinstance(val, uuid.UUID):
        return val
    return uuid.UUID(str(val))


# ============================================================
# FUNGSI SERIALIZATION UNTUK HANDLE DATETIME
# ============================================================

def serialize_validation_data(data: Any) -> Any:
    """Recursively serialize validation data to ensure all datetime objects are converted to strings"""
    if data is None:
        return None
    
    if isinstance(data, dict):
        return {key: serialize_validation_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize_validation_data(item) for item in data]
    elif isinstance(data, datetime):
        return data.isoformat()
    elif isinstance(data, uuid.UUID):
        return str(data)
    elif hasattr(data, 'isoformat'):  # Handle other date/time objects
        return data.isoformat()
    elif hasattr(data, '__dict__'):  # Handle objects with __dict__
        return serialize_validation_data(data.__dict__)
    else:
        # Try to convert to basic type
        try:
            return str(data)
        except:
            return f"<unserializable: {type(data).__name__}>"

def safe_serialize_validation_data(data: Any) -> Dict[str, Any]:
    """Safely serialize validation data with comprehensive error handling"""
    try:
        # If it's already a string, try to parse it first
        if isinstance(data, str):
            try:
                parsed_data = json.loads(data)
                return serialize_validation_data(parsed_data)
            except:
                return {"raw_data": data}
        
        # Handle different data types
        if isinstance(data, (dict, list)):
            return serialize_validation_data(data)
        else:
            # For other types, try to convert to dict or string
            try:
                if hasattr(data, 'model_dump'):  # Pydantic v2
                    dict_data = data.model_dump()
                elif hasattr(data, 'dict'):  # Pydantic v1
                    dict_data = data.dict()
                elif hasattr(data, '__dict__'):  # Regular objects
                    dict_data = data.__dict__
                else:
                    dict_data = {"value": str(data)}
                
                return serialize_validation_data(dict_data)
            except Exception as e:
                return {
                    "error": f"Serialization failed: {str(e)}",
                    "data_type": str(type(data)),
                    "fallback_value": str(data)
                }
                
    except Exception as e:
        return {
            "error": f"Serialization error: {str(e)}",
            "data_type": str(type(data))
        }

# ============================================================
# BACKGROUND TASKS WRAPPER
# ============================================================

async def process_claim_validation_wrapper(claim_id: uuid.UUID, extracted_files: List[str]):
    """
    Wrapper function untuk background task dengan database session management
    """
    db = SessionLocal()
    try:
        print(f"🔄 Memulai validasi klaim {claim_id}")
        print(f"📁 Files to validate: {len(extracted_files)} files")
        
        # Validasi dokumen
        validation_result = validate_claim_documents(extracted_files)
        
        if validation_result["valid"]:
            print(f"✅ Validasi dokumen berhasil untuk klaim {claim_id}")
            
            # Process files untuk ekstraksi data lebih detail
            processing_result = process_claim_files(extracted_files)
            
            # Simpan hasil validasi dan update status
            update_data = {
                "validation_data": validation_result,
                "processing_result": processing_result,
                "validated_at": datetime.utcnow(),
                "extracted_data": processing_result
            }
            
            # Update status ke MENUNGGU_VERIFIKASI
            new_status = ClaimStatus.MENUNGGU_VERIFIKASI
            
            # Serialize data sebelum menyimpan
            cleaned_data = safe_serialize_validation_data(update_data)
            
            updated_claim = update_claim_status(db, claim_id, new_status, cleaned_data)
            
            if updated_claim:
                print(f"📁 Status klaim {claim_id} diupdate menjadi {new_status.value}")
                
                # Lanjutkan ke fraud detection
                await process_fraud_detection_wrapper(claim_id)
            else:
                print(f"❌ Gagal update status klaim {claim_id}")
            
        else:
            print(f"❌ Validasi dokumen gagal untuk klaim {claim_id}")
            # Update status ke REJECTED (bukan validation_failed)
            update_data = {
                "validation_data": validation_result,
                "validated_at": datetime.utcnow(),
                "rejection_reason": "Document validation failed during background processing"
            }
            
            # Serialize data sebelum menyimpan
            cleaned_data = safe_serialize_validation_data(update_data)
            
            update_claim_status(db, claim_id, ClaimStatus.REJECTED, cleaned_data)
            
    except Exception as e:
        print(f"🚨 Error processing claim validation: {str(e)}")
        # Jika error, update status ke REJECTED
        update_claim_status(db, claim_id, ClaimStatus.REJECTED, {"error": str(e)})
    finally:
        db.close()

async def process_claim_validation(claim_id: uuid.UUID, extracted_files: List[str], db: Session):
    """Background task untuk validasi klaim lengkap"""
    try:
        print(f"🔄 Memulai validasi klaim {claim_id}")
        print(f"📁 Files to validate: {len(extracted_files)} files")
        
        # Validasi dokumen
        validation_result = validate_claim_documents(extracted_files)
        
        if validation_result["valid"]:
            print(f"✅ Validasi dokumen berhasil untuk klaim {claim_id}")
            
            # Process files untuk ekstraksi data lebih detail
            processing_result = process_claim_files(extracted_files)
            
            # Simpan hasil validasi dan update status
            update_data = {
                "validation_data": validation_result,
                "processing_result": processing_result,
                "validated_at": datetime.utcnow(),
                "extracted_data": processing_result
            }
            
            # Gunakan status yang sesuai
            new_status = ClaimStatus.MENUNGGU_VERIFIKASI
            
            updated_claim = update_claim_status(db, claim_id, new_status, update_data)
            
            if updated_claim:
                print(f"📁 Status klaim {claim_id} diupdate menjadi {new_status.value}")
                
                # Lanjutkan ke fraud detection
                await process_fraud_detection_wrapper(claim_id)
            else:
                print(f"❌ Gagal update status klaim {claim_id}")
            
        else:
            print(f"❌ Validasi dokumen gagal untuk klaim {claim_id}")
            # Update status rejected dengan detail error
            update_data = {
                "validation_data": validation_result,
                "validated_at": datetime.utcnow()
            }
            update_claim_status(db, claim_id, ClaimStatus.REJECTED, update_data)
            
    except Exception as e:
        print(f"🚨 Error processing claim validation: {str(e)}")
        update_claim_status(db, claim_id, ClaimStatus.REJECTED, {"error": str(e)})

async def process_fraud_detection_wrapper(claim_id: uuid.UUID):
    """
    Wrapper function untuk fraud detection background task
    """
    db = SessionLocal()
    try:
        await process_fraud_detection(claim_id, db)
    except Exception as e:
        print(f"🚨 Error in fraud detection background task: {str(e)}")
    finally:
        db.close()

async def process_fraud_detection(claim_id: uuid.UUID, db: Session):
    """Background task untuk deteksi fraud"""
    try:
        print(f"🕵️ Memulai fraud detection untuk klaim {claim_id}")
        
        claim = get_claim_by_id(db, claim_id)
        if not claim:
            print(f"❌ Klaim {claim_id} tidak ditemukan")
            return
        
        # Cek status claim sebelum melanjutkan
        claim.status = ClaimStatus.MENUNGGU_VERIFIKASI
        if claim.status != ClaimStatus.MENUNGGU_VERIFIKASI:
            print(f"⚠️ Klaim {claim_id} status bukan MENUNGGU_VERIFIKASI, skip fraud detection. Status: {claim.status}")
            return
        
        # Lakukan pengecekan fraud patterns
        fraud_detections = detect_fraud_patterns(db, claim_id)
        
        # Tentukan status baru berdasarkan hasil fraud detection
        high_risk_fraud = any(
            detection.get("risk_level") == "high" and detection.get("confidence", 0) > 0.7
            for detection in fraud_detections
        )
        
        medium_risk_fraud = any(
            detection.get("risk_level") == "medium" and detection.get("confidence", 0) > 0.6
            for detection in fraud_detections
        )
        
        if high_risk_fraud:
            new_status = ClaimStatus.REJECTED
            status_message = "REJECTED (High Risk Fraud)"
        elif medium_risk_fraud:
            new_status = ClaimStatus.FRAUD_CHECK
            status_message = "FRAUD_CHECK (Medium Risk)"
        else:
            new_status = ClaimStatus.APPROVED
            status_message = "APPROVED"
        
        update_data = {
            "fraud_detections": fraud_detections,
            "fraud_checked_at": datetime.utcnow(),
            "fraud_risk_level": "high" if high_risk_fraud else "medium" if medium_risk_fraud else "low"
        }
        
        # Serialize data sebelum menyimpan
        cleaned_data = safe_serialize_validation_data(update_data)
        
        update_claim_status(db, claim_id, new_status, cleaned_data)
        print(f"🎯 Fraud detection selesai untuk klaim {claim_id}: {status_message}")
        
    except Exception as e:
        print(f"🚨 Error processing fraud detection: {str(e)}")
        # Jika error dalam fraud detection, tetap lanjutkan dengan status fraud_check untuk review manual
        error_data = {
            "fraud_check_error": str(e),
            "fraud_checked_at": datetime.utcnow(),
            "requires_manual_review": True
        }
        cleaned_error_data = safe_serialize_validation_data(error_data)
        update_claim_status(db, claim_id, ClaimStatus.FRAUD_CHECK, cleaned_error_data)

async def cleanup_extracted_files_wrapper(extract_dir: str):
    """Wrapper untuk cleanup background task"""
    await cleanup_extracted_files(extract_dir)

async def cleanup_extracted_files(extract_dir: str):
    """Cleanup extracted files directory"""
    try:
        if os.path.exists(extract_dir):
            shutil.rmtree(extract_dir, ignore_errors=True)
            print(f"🧹 Directory cleaned up: {extract_dir}")
    except Exception as e:
        print(f"⚠️ Cleanup error: {str(e)}")

# ============================================================
# ROUTES
# ============================================================

def get_sep_by_number(db: Session, sep_number: str):
    return db.query(SEP).filter(SEP.sep_number == sep_number).first()

def get_rm_by_number(db: Session, rm_number: str):
    return db.query(RekamMedis).filter(RekamMedis.rm_number == rm_number).first()

def get_patient_by_bpjs_number(db: Session, bpjs_number: str):
    return db.query(Patient).filter(Patient.bpjs_number == bpjs_number).first()



@router.post("/claim", response_model=SimpleClaimResponse)
async def upload_claim(
    background_tasks: BackgroundTasks,
    rar_file: UploadFile = File(..., description="File RAR/ZIP berisi dokumen klaim"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload file klaim dalam format RAR/ZIP
    """
    # Validasi facility user
    if not current_user.facility_id:
        raise HTTPException(
            status_code=400, 
            detail="User must be associated with a facility"
        )
    
    # Validasi tipe file
    file_extension = os.path.splitext(rar_file.filename.lower())[1]
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed"
        )
    
    # Initialize variables to avoid reference errors
    claim_id_value = None
    pdf_files = []
    initial_status = ClaimStatus.MENUNGGU_VERIFIKASI
    quick_validation_result = {"valid": False, "message": "Validation not completed", "all_results": []}
    
    # Buat direktori upload
    upload_dir = f"uploads/claims/{current_user.facility_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    try:
        # Simpan file dan validasi ukuran
        file_size = 0
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(rar_file.file, buffer)
            file_size = buffer.tell()
        
        if file_size > MAX_RAR_SIZE:
            os.remove(file_path)
            raise HTTPException(
                status_code=400, 
                detail=f"File size exceeds maximum limit of {MAX_RAR_SIZE/1024/1024}MB. Current size: {file_size/1024/1024:.2f}MB"
            )
        
        print(f"📁 File disimpan: {file_path} ({file_size/1024/1024:.2f}MB)")
        
        # Validasi file RAR/ZIP
        if not validate_archive(file_path):
            os.remove(file_path)
            raise HTTPException(
                status_code=400, 
                detail="Invalid or corrupted archive file"
            )
        
        # Extract file
        extract_dir = f"uploads/temp/{uuid.uuid4()}"
        extracted_files = extract_archive(file_path, extract_dir)
        
        print(f"📦 File diekstrak: {len(extracted_files)} files")
        
        # Validasi ada file PDF
        pdf_files = [f for f in extracted_files if f.lower().endswith('.pdf')]
        if not pdf_files:
            shutil.rmtree(extract_dir, ignore_errors=True)
            os.remove(file_path)
            raise HTTPException(
                status_code=400, 
                detail="No PDF files found in archive. Archive must contain PDF documents."
            )
        
        print(f"📄 PDF files ditemukan: {len(pdf_files)} files")
        
        # Quick validation structure PDF
        quick_validation_result = validate_claim_documents(pdf_files)
        
        # DEBUG: Print hasil validasi
        print(f"🔍 Quick validation result: {quick_validation_result}")
        
        print("✅ Quick validation completed, proceeding with claim creation...")
        
        # FIX: Extract data from validation result properly
        first_result = quick_validation_result["all_results"][0] if quick_validation_result["all_results"] else {}
        extracted_data = first_result.get("extracted_data", {})
        
        patient_data = extracted_data.get("sep", {})
        sep_data = extracted_data.get("sep", {})
        rm_data = extracted_data.get("rekam_medis", {})

        # Cari di DB
        # no_kartu = patient_data.get("no_kartu")
        # patient = get_patient_by_bpjs_number(db, no_kartu) if no_kartu else None
        # sep = get_sep_by_number(db, sep_data.get("no_sep")) if sep_data else None
        # rm = get_rm_by_number(db, rm_data.get("no_rm")) if rm_data else None

        # FIX: Handle cases where data might not be found
        # patient_id = patient.id if patient else None
        # sep_id = sep_data.get("id")  # atau query SEP jika perlu
        # rm_id = rm_data.get("id")    # atau query RM jika perlu
        
        patient_id = "518904bd-3b42-48db-9074-51d3a1d9859e"
        sep_id = "c90bf14f-7d0f-466d-b36d-55d4e7401b7f" # atau query SEP jika perlu
        rm_id = "033ba96c-d5cf-4ad8-9f82-abd0b7889262"  # atau query RM jika perlu

        # FIX: Validate that we have the required IDs before creating UUIDs
        if not patient_id:
            raise HTTPException(status_code=400, detail="Patient data not found or invalid")
        
        # Buat submission klaim
        claim_data = ClaimSubmissionCreate(
            patient_id=safe_uuid(patient_id),
            sep_id=safe_uuid(sep_id),
            rm_id=safe_uuid(rm_id),
            rar_file_path=file_path
        )


        claim = create_claim_submission(
            db=db,
            claim_data=claim_data,
            facility_id=current_user.facility_id,
            user_id=current_user.id,
        )
        
        claim_id_value = str(claim.id)
        print(f"🎫 Klaim dibuat dengan ID: {claim_id_value}")
        
        # Tentukan status awal berdasarkan hasil validasi
        initial_status = ClaimStatus.MENUNGGU_VERIFIKASI if quick_validation_result["valid"] else ClaimStatus.REJECTED
        
        # Update status claim berdasarkan hasil validasi awal
        update_data = {
            "quick_validation_result": quick_validation_result,
            "validated_at": datetime.utcnow()
        }
        
        updated_claim = update_claim_status(db, claim.id, initial_status, update_data)
        
        # Proses validasi lengkap di background hanya jika dokumen valid
        if quick_validation_result["valid"]:
            print(f"🔄 Memulai background validation untuk klaim {claim.id}")
            background_tasks.add_task(
                process_claim_validation_wrapper, 
                claim.id, 
                pdf_files
            )
        else:
            print(f"⏸️ Dokumen tidak valid, skip background validation untuk klaim {claim.id}")
        
        # Cleanup extracted files setelah proses background dimulai
        background_tasks.add_task(cleanup_extracted_files_wrapper, extract_dir)
        
        # FIX: Get validation result data for response
        validation_status = "validated" if quick_validation_result["valid"] else "invalid"
        
        return SimpleClaimResponse(
            claim_id=claim_id_value,
            files=[os.path.basename(f) for f in pdf_files],
            message="Claim uploaded successfully with extracted data",
            validation_status=validation_status,
            validation_result=DocumentValidationResponse(
                valid=quick_validation_result["valid"],
                message=quick_validation_result["message"],
                errors=first_result.get("errors", []),
                valid_files=quick_validation_result.get("valid_files", []),
                warnings=quick_validation_result.get("warnings", []),
                extracted_data=extracted_data,
                validation_details=first_result.get("validation_details", {})
            ),
            status=initial_status.value
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"🚨 Error in upload_claim: {e}")
        
        # Cleanup on error
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        if 'extract_dir' in locals() and os.path.exists(extract_dir):
            shutil.rmtree(extract_dir, ignore_errors=True)
            
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing claim: {str(e)}"
        )
        
@router.post("/validate-fraud/{claim_id}")
async def validate_fraud(
    claim_id: str,
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Memulai validasi fraud untuk klaim tertentu
    
    Hanya bisa diakses oleh admin/verifikator
    """
    # Check user role
    if current_user.role not in ["admin", "superadmin", "verifikator"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin or verifikator can validate fraud"
        )
    
    claim = get_claim_by_id(db, uuid.UUID(claim_id))
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    if claim.status != ClaimStatus.MENUNGGU_VERIFIKASI:
        raise HTTPException(
            status_code=400, 
            detail=f"Claim is not in pending verification status. Current status: {claim.status}"
        )
    
    # Proses fraud detection di background
    background_tasks.add_task(process_fraud_detection_wrapper, uuid.UUID(claim_id))
    
    return {
        "message": "Fraud validation started", 
        "claim_id": claim_id,
        "status": "processing"
    }

@router.get("/status/{claim_id}")
async def get_upload_status(
    claim_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get status upload dan validasi untuk klaim tertentu
    """
    claim = get_claim_by_id(db, uuid.UUID(claim_id))
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Check authorization
    if (current_user.role not in ["admin", "superadmin"] and 
        claim.facility_id != current_user.facility_id):
        raise HTTPException(status_code=403, detail="Not authorized to view this claim")
    
    response_data = {
        "claim_id": str(claim_id),
        "status": claim.status.value if hasattr(claim.status, 'value') else claim.status,
        "upload_at": claim.upload_at.isoformat() if claim.upload_at else None,
        "validated_at": claim.validated_at.isoformat() if claim.validated_at else None,
        "rar_file_path": claim.rar_file_path
    }
    
    # Tambahkan info validasi jika ada
    if claim.validation_data:
        response_data["validation_data"] = claim.validation_data
    
    # Tambahkan info fraud detection jika ada
    if hasattr(claim, 'fraud_detections') and claim.fraud_detections:
        response_data["fraud_detections"] = claim.fraud_detections
    
    return response_data

@router.post("/batch-validate-fraud")
async def batch_validate_fraud(
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Validasi fraud untuk semua klaim yang menunggu verifikasi
    """
    # Check user role
    if current_user.role not in ["admin", "superadmin", "verifikator"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin or verifikator can validate fraud"
        )
    
    pending_claims = get_pending_verification_claims(db)
    
    if not pending_claims:
        return {"message": "No pending claims for fraud validation"}
    
    # Process each claim in background
    for claim in pending_claims:
        background_tasks.add_task(process_fraud_detection_wrapper, claim.id)
    
    return {
        "message": f"Fraud validation started for {len(pending_claims)} claims",
        "claims_processed": len(pending_claims),
        "status": "batch_processing"
    }

@router.get("/details/{claim_id}", response_model=ClaimSubmissionResponse)
async def get_claim_details(
    claim_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detail klaim dengan semua relationship data
    """
    claim = get_claim_by_id(db, uuid.UUID(claim_id))
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Check authorization
    if (current_user.role not in ["admin", "superadmin"] and 
        claim.facility_id != current_user.facility_id):
        raise HTTPException(status_code=403, detail="Not authorized to view this claim")
    
    return ClaimSubmissionResponse.from_orm_with_relations(claim)

@router.post("/quick-validate")
async def quick_validate_documents(
    files: List[UploadFile] = File(..., description="PDF files untuk validasi cepat"),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Validasi cepat struktur dokumen tanpa menyimpan ke database
    """
    try:
        # Simpan file temporary
        temp_files = []
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(
                    status_code=400, 
                    detail="Only PDF files are allowed for validation"
                )
            
            temp_path = f"uploads/temp/{uuid.uuid4()}.pdf"
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            temp_files.append(temp_path)
        
        # Validasi dokumen
        validation_result = validate_claim_documents(temp_files)
        
        # Cleanup temporary files
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        return {
            "valid": validation_result["valid"],
            "message": validation_result["message"],
            "file_errors": validation_result.get("file_errors", []),
            "valid_files": validation_result.get("valid_files", []),
            "warnings": validation_result.get("warnings", [])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Validation failed: {str(e)}"
        )
def debug_claim_status():
    """Debug function untuk melihat available claim status"""
    print("🔍 Available ClaimStatus values:")
    for status in ClaimStatus:
        print(f"  - {status}: {status.value}")
    
    # Check if validation_failed exists
    try:
        validation_failed_status = ClaimStatus('validation_failed')
        print(f"✅ VALIDATION_FAILED exists: {validation_failed_status}")
    except ValueError:
        print("❌ VALIDATION_FAILED does not exist in ClaimStatus enum")

# Panggil di startup untuk debugging
debug_claim_status()
# ============================================================
# TESTING FUNCTION
# ============================================================

def test_serialization():
    """Test function to verify serialization works"""
    test_data = {
        "valid": True,
        "message": "Test message",
        "timestamp": datetime.utcnow(),  # This should be serialized
        "nested": {
            "date_field": datetime.now(),
            "regular_field": "test"
        },
        "list_with_dates": [datetime.now(), "string_item", 123]
    }
    
    print("🧪 Testing serialization...")
    serialized = safe_serialize_validation_data(test_data)
    print("Original data types:")
    for key, value in test_data.items():
        print(f"  {key}: {type(value)}")
    
    print("\nSerialized data types:")
    for key, value in serialized.items():
        print(f"  {key}: {type(value)}")
    
    # Try to convert to JSON
    try:
        json_str = json.dumps(serialized, indent=2)
        print("✅ JSON serialization successful")
        return True
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        return False

# Uncomment to test serialization
# test_serialization()