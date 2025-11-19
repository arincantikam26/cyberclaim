
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

class DiagnosisBase(BaseModel):
    code: str
    description: str

class DiagnosisResponse(DiagnosisBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TindakanBase(BaseModel):
    code: str
    description: str

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