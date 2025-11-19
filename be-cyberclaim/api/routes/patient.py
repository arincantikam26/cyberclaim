from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.crud.patient import get_patient, get_patients, create_patient, update_patient
from app.models.patient import Patient


router = APIRouter()

@router.get("/", response_model=List[PatientResponse])
def read_patients(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Filter berdasarkan role
    if current_user.role.name in ["uploader", "faskes"]:
        # Hanya pasien dari facility yang sama
        from app.models.claim import ClaimSubmission
        facility_patient_ids = db.query(ClaimSubmission.patient_id).filter(
            ClaimSubmission.facility_id == current_user.facility_id
        ).distinct().all()
        facility_patient_ids = [pid[0] for pid in facility_patient_ids]
        
        patients = db.query(Patient).filter(Patient.id.in_(facility_patient_ids))
        if search:
            patients = patients.filter(Patient.name.ilike(f"%{search}%"))
        patients = patients.offset(skip).limit(limit).all()
    else:
        # Admin dan superadmin bisa lihat semua
        patients = get_patients(db, skip=skip, limit=limit, search=search)
    
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
def read_patient(
    patient_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"]:
        from app.models.claim import ClaimSubmission
        has_access = db.query(ClaimSubmission).filter(
            ClaimSubmission.patient_id == patient_id,
            ClaimSubmission.facility_id == current_user.facility_id
        ).first()
        if not has_access:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return patient

@router.post("/", response_model=PatientResponse)
def create_new_patient(
    patient: PatientCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_patient(db=db, patient=patient)

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient_info(
    patient_id: uuid.UUID,
    patient_update: PatientUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = update_patient(db=db, patient_id=patient_id, patient_update=patient_update)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient