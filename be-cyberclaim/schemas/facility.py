from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class JenisSaranaBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None

class JenisSaranaResponse(JenisSaranaBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class FacilityBase(BaseModel):
    code: str
    name: str
    telp: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    jenis_sarana_id: int
    operasional: bool = True

class FacilityCreate(FacilityBase):
    pass

class FacilityUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    telp: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    jenis_sarana_id: Optional[int] = None
    operasional: Optional[bool] = None

class FacilityResponse(FacilityBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    jenis_sarana: JenisSaranaResponse
    
    class Config:
        from_attributes = True