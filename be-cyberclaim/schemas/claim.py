from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

class ClaimStatus(str, Enum):
    UPLOADED = "uploaded"
    MENUNGGU_VERIFIKASI = "menunggu_verifikasi"
    VALIDATED = "validated"
    FRAUD_CHECK = "fraud_check"
    REJECTED = "rejected"
    APPROVED = "approved"
    INVALID = "invalid"                     # baru
    VALIDATION_FAILED = "validation_failed" # baru


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
    
    model_config = ConfigDict(from_attributes=True)

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
    
    # Computed fields from relationships
    facility_name: Optional[str] = None
    user_name: Optional[str] = None
    patient_name: Optional[str] = None
    sep_number: Optional[str] = None
    validator_name: Optional[str] = None
    claim_files: List[ClaimFilesResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
        
    @classmethod
    def from_orm_with_relations(cls, obj):
        """Custom method to create response with relationship data"""
        response_data = {
            "id": obj.id,
            "facility_id": obj.facility_id,
            "user_id": obj.user_id,
            "patient_id": obj.patient_id,
            "sep_id": obj.sep_id,
            "rm_id": obj.rm_id,
            "rar_file_path": obj.rar_file_path,
            "upload_at": obj.upload_at,
            "status": obj.status,
            "notes": obj.notes,
            "validated_by": obj.validated_by,
            "validated_at": obj.validated_at,
            "validation_data": obj.validation_data,
            
            # Populate from relationships - using correct field names
            "facility_name": obj.facility.name if obj.facility else None,
            "user_name": obj.user.full_name if obj.user else None,
            "patient_name": obj.patient.name if obj.patient else None,
            "sep_number": obj.sep.sep_number if obj.sep else None,
            "validator_name": obj.validator.full_name if obj.validator else None,
            "claim_files": [ClaimFilesResponse.model_validate(file) for file in obj.claim_files] if obj.claim_files else []
        }
        return cls(**response_data)

# Additional Schemas for Document Validation
class DocumentValidationResponse(BaseModel):
    valid: bool
    message: str
    file_errors: List[Dict[str, Any]] = []
    valid_files: List[Dict[str, Any]] = []
    warnings: List[str] = []
    extracted_data: Optional[Dict] = None     # ✅ TAMBAH INI
    validation_details: Optional[Dict] = None # ✅ TAMBAH INI

    model_config = ConfigDict(from_attributes=True)

# Simple upload for testing (without database)
class SimpleClaimUpload(BaseModel):
    files: List[str]
    
    model_config = ConfigDict(from_attributes=True)

class SimpleClaimResponse(BaseModel):
    claim_id: Optional[str] = None
    files: List[str]
    message: str
    validation_status:  ClaimStatus

    validation_result: DocumentValidationResponse
    status: Optional[str] = None  # Status claim di database
    
    class Config:
        from_attributes = True