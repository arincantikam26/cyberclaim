from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import uuid

class DoctorBase(BaseModel):
    name: str
    specialization: Optional[str] = None
    bpjs_id: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    telp: Optional[str] = None
    address: Optional[str] = None
    facility_id: uuid.UUID

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    bpjs_id: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    telp: Optional[str] = None
    address: Optional[str] = None
    facility_id: Optional[uuid.UUID] = None
    is_active: Optional[bool] = None

class DoctorResponse(DoctorBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    facility_name: str
    
    class Config:
        from_attributes = True