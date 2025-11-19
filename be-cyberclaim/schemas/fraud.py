from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class FraudDetectionBase(BaseModel):
    detection_type: str
    risk_level: Optional[str] = None
    confidence: Optional[float] = None
    description: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class FraudDetectionCreate(FraudDetectionBase):
    claim_id: uuid.UUID

class FraudDetectionUpdate(BaseModel):
    risk_level: Optional[str] = None
    confidence: Optional[float] = None
    description: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    is_resolved: Optional[bool] = None
    resolved_notes: Optional[str] = None

class FraudDetectionResponse(FraudDetectionBase):
    id: uuid.UUID
    claim_id: uuid.UUID
    is_resolved: bool
    resolved_by: Optional[uuid.UUID]
    resolved_at: Optional[datetime]
    resolved_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    claim_number: str
    patient_name: str
    facility_name: str
    resolver_name: Optional[str] = None
    
    class Config:
        from_attributes = True