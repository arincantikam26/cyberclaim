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

router = APIRouter()

# Konstanta
MAX_RAR_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.rar', '.zip'}

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
        await process_claim_validation(claim_id, extracted_files, db)
    except Exception as e:
        print(f"🚨 Error in background task: {str(e)}")
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

@router.post("/claim", response_model=SimpleClaimResponse)
async def upload_claim(
    background_tasks: BackgroundTasks,
    patient_id: str = Form(..., description="ID Pasien"),
    sep_id: str = Form(..., description="ID SEP"),
    rm_id: str = Form(..., description="ID Rekam Medis"),
    rar_file: UploadFile = File(..., description="File RAR/ZIP berisi dokumen klaim"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload file klaim dalam format RAR/ZIP
    
    Struktur dokumen yang diharapkan dalam PDF:
    - Halaman 1: SEP (Surat Eligibilitas Peserta)
    - Halaman 2: Surat Rujukan  
    - Halaman 3: Rekam Medis (utama)
    - Halaman 4: Lanjutan Rekam Medis
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
                detail=f"File size exceeds maximum limit of 10MB. Current size: {file_size/1024/1024:.2f}MB"
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
        if not quick_validation_result["valid"]:
            shutil.rmtree(extract_dir, ignore_errors=True)
            os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail=quick_validation_result["message"],
                headers={"X-Validation-Errors": str(quick_validation_result.get("file_errors", []))}
            )
        
        print("✅ Validasi struktur PDF berhasil")
        
        # Buat submission klaim
        claim_data = ClaimSubmissionCreate(
            patient_id=uuid.UUID(patient_id),
            sep_id=uuid.UUID(sep_id),
            rm_id=uuid.UUID(rm_id),
            rar_file_path=file_path
        )

        claim = create_claim_submission(
            db=db,
            claim_data=claim_data,
            facility_id=current_user.facility_id,
            user_id=current_user.id,
        )
        
        print(f"🎫 Klaim dibuat dengan ID: {claim.id}")
        
        # Proses validasi lengkap di background - PERBAIKAN: gunakan wrapper
        background_tasks.add_task(
            process_claim_validation_wrapper, 
            claim.id, 
            pdf_files
        )
        
        # Cleanup extracted files setelah proses background dimulai
        background_tasks.add_task(cleanup_extracted_files_wrapper, extract_dir)
        
        return SimpleClaimResponse(
            files=[os.path.basename(f) for f in pdf_files],
            message="Claim uploaded successfully. Validation in progress...",
            validation_status="processing",
            validation_result=DocumentValidationResponse(**quick_validation_result)
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        print(f"🚨 Upload error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Upload failed: {str(e)}"
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