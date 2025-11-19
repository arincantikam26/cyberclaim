from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

class ClaimStatus(str, Enum):
    UPLOADED = "uploaded"
    VALIDATED = "validated"
    FRAUD_CHECK = "fraud_check"
    REJECTED = "rejected"
    APPROVED = "approved"

class ClaimSubmissionBase(BaseModel):
    patient_id: uuid.UUID
    sep_id: uuid.UUID
    rm_id: uuid.UUID
    rar_file_path: str

class ClaimSubmissionCreate(ClaimSubmissionBase):
    pass

class ClaimSubmissionUpdate(BaseModel):
    status: Optional[ClaimStatus] = None
    notes: Optional[str] = None
    validated_by: Optional[uuid.UUID] = None
    validation_data: Optional[Dict[str, Any]] = None

class ClaimFilesBase(BaseModel):
    file_type: str
    file_path: str
    checksum: str

class ClaimFilesResponse(ClaimFilesBase):
    id: uuid.UUID
    claim_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ClaimSubmissionResponse(ClaimSubmissionBase):
    id: uuid.UUID
    facility_id: uuid.UUID
    user_id: uuid.UUID
    upload_at: datetime
    status: ClaimStatus
    notes: Optional[str]
    validated_by: Optional[uuid.UUID]
    validated_at: Optional[datetime]
    validation_data: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    facility_name: str
    user_name: str
    patient_name: str
    sep_number: str
    validator_name: Optional[str] = None
    claim_files: List[ClaimFilesResponse] = []
    
    class Config:
        from_attributes = True