from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse
from app.crud.doctor import get_doctor, get_doctors, create_doctor, update_doctor

router = APIRouter()

@router.get("/", response_model=List[DoctorResponse])
def read_doctors(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    facility_id = None
    if current_user.role.name in ["uploader", "faskes"]:
        facility_id = current_user.facility_id
    
    doctors = get_doctors(db, skip=skip, limit=limit, search=search, facility_id=facility_id)
    return doctors

@router.get("/{doctor_id}", response_model=DoctorResponse)
def read_doctor(
    doctor_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doctor = get_doctor(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Authorization check for facility users
    if current_user.role.name in ["uploader", "faskes"] and doctor.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return doctor

@router.post("/", response_model=DoctorResponse)
def create_new_doctor(
    doctor: DoctorCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Facility users can only create doctors for their facility
    if current_user.role.name in ["uploader", "faskes"]:
        doctor.facility_id = current_user.facility_id
    
    return create_doctor(db=db, doctor=doctor)

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor_info(
    doctor_id: uuid.UUID,
    doctor_update: DoctorUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doctor = get_doctor(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and doctor.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    updated_doctor = update_doctor(db=db, doctor_id=doctor_id, doctor_update=doctor_update)
    return updated_doctor