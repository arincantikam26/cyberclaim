from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from services.auth import get_current_user
from schemas.user import UserResponse
from schemas.facility import FacilityCreate, FacilityUpdate, FacilityResponse, JenisSaranaResponse
from repositories.facility import get_facility, get_facilities, create_facility, update_facility, get_jenis_sarana

router = APIRouter()

@router.get("/", response_model=List[FacilityResponse])
def read_facilities(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    facilities = get_facilities(db, skip=skip, limit=limit)
    return facilities

@router.get("/{facility_id}", response_model=FacilityResponse)
def read_facility(
    facility_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    facility = get_facility(db, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.post("/", response_model=FacilityResponse)
def create_new_facility(
    facility: FacilityCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_facility(db=db, facility=facility)

@router.put("/{facility_id}", response_model=FacilityResponse)
def update_existing_facility(
    facility_id: uuid.UUID,
    facility_update: FacilityUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    facility = update_facility(db=db, facility_id=facility_id, facility_update=facility_update)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.get("/jenis-sarana/", response_model=List[JenisSaranaResponse])
def read_jenis_sarana(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_jenis_sarana(db)