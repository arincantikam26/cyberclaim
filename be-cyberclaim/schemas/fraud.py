from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class FraudDetectionBase(BaseModel):
    detection_type: str
    risk_level: str
    confidence: float
    description: str
    details: Optional[Dict[str, Any]] = None

    @field_validator('confidence')
    @classmethod
    def validate_confidence(cls, v):
        if v < 0 or v > 1:
            raise ValueError('Confidence must be between 0 and 1')
        return v

    @field_validator('risk_level')
    @classmethod
    def validate_risk_level(cls, v):
        valid_levels = ['low', 'medium', 'high', 'critical']
        if v.lower() not in valid_levels:
            raise ValueError(f'Risk level must be one of: {", ".join(valid_levels)}')
        return v.lower()

class FraudDetectionCreate(FraudDetectionBase):
    claim_id: uuid.UUID

class FraudDetectionUpdate(BaseModel):
    risk_level: Optional[str] = None
    confidence: Optional[float] = None
    description: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    is_resolved: Optional[bool] = None
    resolved_notes: Optional[str] = None

    @field_validator('risk_level')
    @classmethod
    def validate_risk_level(cls, v):
        if v is not None:
            valid_levels = ['low', 'medium', 'high', 'critical']
            if v.lower() not in valid_levels:
                raise ValueError(f'Risk level must be one of: {", ".join(valid_levels)}')
            return v.lower()
        return v

    @field_validator('confidence')
    @classmethod
    def validate_confidence(cls, v):
        if v is not None and (v < 0 or v > 1):
            raise ValueError('Confidence must be between 0 and 1')
        return v

class FraudDetectionResponse(FraudDetectionBase):
    id: uuid.UUID
    claim_id: uuid.UUID
    is_resolved: bool
    resolved_by: Optional[uuid.UUID]
    resolved_at: Optional[datetime]
    resolved_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    # Computed fields from relationships
    claim_number: str
    patient_name: str
    facility_name: str
    resolver_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class FraudStatsResponse(BaseModel):
    total_detections: int
    resolved_count: int
    unresolved_count: int
    by_risk_level: Dict[str, int]
    by_detection_type: Dict[str, int]
    high_confidence_count: int