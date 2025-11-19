from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, date
import uuid

class PatientBase(BaseModel):
    name: str
    birth_date: date
    gender: str
    telp: Optional[str] = None
    address: Optional[str] = None
    nik: Optional[str] = None
    bpjs_number: Optional[str] = None
    membership_json: Optional[Dict[str, Any]] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    telp: Optional[str] = None
    address: Optional[str] = None
    nik: Optional[str] = None
    bpjs_number: Optional[str] = None
    membership_json: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class PatientResponse(PatientBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True