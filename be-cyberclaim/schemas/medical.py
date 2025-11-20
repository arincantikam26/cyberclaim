from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

class DiagnosisBase(BaseModel):
    code: str
    description: str

class DiagnosisCreate(DiagnosisBase):
    pass

class DiagnosisUpdate(BaseModel):
    description: Optional[str] = None

class DiagnosisResponse(DiagnosisBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TindakanBase(BaseModel):
    code: str
    description: str

class TindakanCreate(TindakanBase):
    pass

class TindakanUpdate(BaseModel):
    description: Optional[str] = None

class TindakanResponse(TindakanBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TarifINACBGSBase(BaseModel):
    diagnosa_code: str
    description: Optional[str] = None
    tarif_inacbgs: int
    is_active: bool = True

class TarifINACBGSCreate(TarifINACBGSBase):
    pass

# Tambahkan TarifINACBGSUpdate yang missing
class TarifINACBGSUpdate(BaseModel):
    description: Optional[str] = None
    tarif_inacbgs: Optional[int] = None
    is_active: Optional[bool] = None

class TarifINACBGSResponse(TarifINACBGSBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    diagnosis: DiagnosisResponse
    
    class Config:
        from_attributes = True

class SEPBase(BaseModel):
    sep_number: str
    patient_id: uuid.UUID
    facility_id: uuid.UUID
    doctor_id: uuid.UUID
    diagnosa_awal: str
    diagnosa_utama: Optional[str] = None
    poli: Optional[str] = None
    kelas_rawat: Optional[str] = None
    penjamin: Optional[str] = None
    sep_date: date
    rujukan_facility: Optional[str] = None
    qr_code_hash: Optional[str] = None

class SEPCreate(SEPBase):
    pass

class SEPUpdate(BaseModel):
    diagnosa_utama: Optional[str] = None
    poli: Optional[str] = None
    kelas_rawat: Optional[str] = None
    penjamin: Optional[str] = None
    rujukan_facility: Optional[str] = None

class SEPResponse(SEPBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    patient_name: str
    facility_name: str
    doctor_name: str
    diagnosis_name: str
    
    class Config:
        from_attributes = True

class RekamMedisBase(BaseModel):
    patient_id: uuid.UUID
    sep_id: uuid.UUID
    dokter_id: uuid.UUID
    tanggal_masuk: datetime
    tanggal_keluar: Optional[datetime] = None
    diagnosa_masuk: Optional[str] = None
    diagnosa_utama: str
    diagnosa_sekunder: Optional[List[str]] = None
    tindakan: Optional[List[str]] = None
    komplikasi: Optional[str] = None
    alergi: Optional[str] = None
    icd_x: Optional[str] = None
    berkas_path: Optional[str] = None

class RekamMedisCreate(RekamMedisBase):
    pass

class RekamMedisUpdate(BaseModel):
    tanggal_keluar: Optional[datetime] = None
    diagnosa_masuk: Optional[str] = None
    diagnosa_utama: Optional[str] = None
    diagnosa_sekunder: Optional[List[str]] = None
    tindakan: Optional[List[str]] = None
    komplikasi: Optional[str] = None
    alergi: Optional[str] = None
    icd_x: Optional[str] = None
    berkas_path: Optional[str] = None

class RekamMedisResponse(RekamMedisBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    patient_name: str
    sep_number: str
    doctor_name: str
    diagnosis_name: str
    
    class Config:
        from_attributes = True

# Schema untuk fraud detection dan validasi
class ICDValidationResult(BaseModel):
    code: str
    description: str
    is_valid: bool
    validation_message: Optional[str] = None

class MedicalRecordValidation(BaseModel):
    has_signature: bool
    diagnosis_match: bool
    required_fields_complete: bool
    validation_errors: List[str] = []

class SEPValidation(BaseModel):
    is_valid: bool
    required_fields_complete: bool
    diagnosis_valid: bool
    validation_errors: List[str] = []

class ClaimValidationResult(BaseModel):
    sep_validation: SEPValidation
    medical_record_validation: MedicalRecordValidation
    overall_status: str  # "valid", "warning", "invalid"
    validation_messages: List[str] = []