from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os
from typing import List
import shutil
import base64
import tempfile

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.claim import ClaimSubmissionCreate, ClaimSubmissionResponse
from app.crud.claim import create_claim_submission, update_claim_status
from app.utils.file_utils import validate_rar_file, extract_rar_file, calculate_checksum
from app.services.validation import validate_claim_documents

# Import service validasi SEP
# from app.services.validation import validate_claim_documents

router = APIRouter()

async def process_sep_validation(claim_id: uuid.UUID, file_path: str, db: Session):
    """Background task untuk validasi SEP"""
    try:
        # Baca file PDF
        with open(file_path, "rb") as f:
            file_content = f.read()
        file_content_b64 = base64.b64encode(file_content).decode('utf-8')
        
        # Validasi file menggunakan service validasi SEP
        validation_data = validate_claim_documents.validate_pdf_file(file_content_b64, "claim_document.pdf")
        
        if validation_data['success']:
            # Simpan hasil validasi ke database
            batch_id = validate_claim_documents.save_validation_to_db(db, validation_data, "claim_document.pdf")
            
            # Update status claim berdasarkan hasil validasi
            validasi_result = validation_data['validation_result']
            if validasi_result['overall']['status'] == 'BERHASIL':
                new_status = "validated"
            elif validasi_result['overall']['status'] == 'BERHASIL DENGAN PERINGATAN':
                new_status = "fraud_check"  # Butuh pemeriksaan lebih lanjut
            else:
                new_status = "rejected"
            
            update_claim_status(db, claim_id, new_status, {
                "validation_batch_id": batch_id,
                "validation_result": validasi_result,
                "sep_info": validation_data['sep_info'],
                "rujukan_info": validation_data['rujukan_info'],
                "rekam_medis_info": validation_data['rekam_medis_info']
            })
        
    except Exception as e:
        print(f"Error processing SEP validation: {str(e)}")
        update_claim_status(db, claim_id, "rejected", {"error": str(e)})

@router.post("/claim", response_model=ClaimSubmissionResponse)
async def upload_claim(
    background_tasks: BackgroundTasks,
    patient_id: str = Form(...),
    sep_id: str = Form(...),
    rm_id: str = Form(...),
    rar_file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has facility (required for uploaders)
    if not current_user.facility_id:
        raise HTTPException(status_code=400, detail="User must be associated with a facility")
    
    # Validate file type
    if not rar_file.filename.lower().endswith('.rar'):
        raise HTTPException(status_code=400, detail="Only RAR files are allowed")
    
    # Create upload directory
    upload_dir = f"app/uploads/claims/{current_user.facility_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save RAR file
    file_extension = os.path.splitext(rar_file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(rar_file.file, buffer)
    
    # Validate RAR file
    if not validate_rar_file(file_path):
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="Invalid RAR file")
    
    # Extract and validate documents
    extract_dir = f"app/uploads/temp/{uuid.uuid4()}"
    try:
        extracted_files = extract_rar_file(file_path, extract_dir)
        
        # Validate required documents
        validation_result = validate_claim_documents(extracted_files)
        
        if not validation_result["valid"]:
            raise HTTPException(status_code=400, detail=validation_result["message"])
        
        # Create claim submission
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
            user_id=current_user.id
        )
        
        # Process SEP validation in background
        # Cari file SEP dalam extracted files
        sep_file = next((f for f in extracted_files if 'sep' in f.lower() and f.endswith('.pdf')), None)
        if sep_file:
            background_tasks.add_task(process_sep_validation, claim.id, sep_file, db)
        
        return claim
        
    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(extract_dir):
            shutil.rmtree(extract_dir)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup extracted files
        if os.path.exists(extract_dir):
            shutil.rmtree(extract_dir)

@router.get("/claims")
def get_claim_list(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.crud.claim import get_claims_by_facility, get_claims
    
    if current_user.role.name in ["admin", "superadmin"]:
        claims = get_claims(db, skip=skip, limit=limit)
    else:
        claims = get_claims_by_facility(db, current_user.facility_id, skip=skip, limit=limit)
    
    return claims