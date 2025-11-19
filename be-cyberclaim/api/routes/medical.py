from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.medical import SEPResponse, RekamMedisResponse, SEPCreate, RekamMedisCreate
from app.crud.medical import get_sep, get_seps, create_sep, get_medical_record, get_medical_records, create_medical_record
from app.models.medical import SEP, RekamMedis

router = APIRouter()

@router.get("/sep/", response_model=List[SEPResponse])
def read_seps(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name in ["uploader", "faskes"]:
        # Hanya SEP dari facility yang sama
        seps = db.query(SEP).filter(SEP.facility_id == current_user.facility_id)
        if search:
            seps = seps.filter(SEP.sep_number.ilike(f"%{search}%"))
        seps = seps.offset(skip).limit(limit).all()
    else:
        # Admin dan superadmin bisa lihat semua
        seps = get_seps(db, skip=skip, limit=limit, search=search)
    
    return seps

@router.get("/sep/{sep_id}", response_model=SEPResponse)
def read_sep(
    sep_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sep = get_sep(db, sep_id)
    if not sep:
        raise HTTPException(status_code=404, detail="SEP not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and sep.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return sep

@router.post("/sep/", response_model=SEPResponse)
def create_new_sep(
    sep: SEPCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Facility users can only create SEP for their facility
    if current_user.role.name in ["uploader", "faskes"]:
        sep.facility_id = current_user.facility_id
    
    return create_sep(db=db, sep=sep)

@router.get("/rekam-medis/", response_model=List[RekamMedisResponse])
def read_medical_records(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name in ["uploader", "faskes"]:
        # Hanya rekam medis dari facility yang sama melalui SEP
        medical_records = db.query(RekamMedis).join(SEP).filter(
            SEP.facility_id == current_user.facility_id
        ).offset(skip).limit(limit).all()
    else:
        # Admin dan superadmin bisa lihat semua
        medical_records = get_medical_records(db, skip=skip, limit=limit)
    
    return medical_records

@router.get("/rekam-medis/{rm_id}", response_model=RekamMedisResponse)
def read_medical_record(
    rm_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    medical_record = get_medical_record(db, rm_id)
    if not medical_record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and medical_record.sep.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return medical_record

@router.post("/rekam-medis/", response_model=RekamMedisResponse)
def create_new_medical_record(
    rm: RekamMedisCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if SEP belongs to user's facility
    if current_user.role.name in ["uploader", "faskes"]:
        sep = get_sep(db, rm.sep_id)
        if not sep or sep.facility_id != current_user.facility_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_medical_record(db=db, rm=rm)