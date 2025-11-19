from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from database import Base

class ValidationBatch(Base):
    __tablename__ = "validation_batches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String(255), nullable=False)
    status = Column(String(50), default="processed")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sep_data = relationship("SEPData", back_populates="batch", uselist=False)
    medical_records = relationship("MedicalRecord", back_populates="batch", uselist=False)
    referral_letters = relationship("ReferralLetter", back_populates="batch", uselist=False)
    validation_results = relationship("ValidationResult", back_populates="batch")

class SEPData(Base):
    __tablename__ = "sep_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("validation_batches.id"), nullable=False)
    no_sep = Column(String(50), nullable=False)
    tgl_sep = Column(DateTime)
    no_kartu = Column(String(50))
    nama_pasien = Column(String(100))
    diagnosa_kode = Column(String(10))
    diagnosa_deskripsi = Column(String(255))
    extracted_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    batch = relationship("ValidationBatch", back_populates="sep_data")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("validation_batches.id"), nullable=False)
    no_rm = Column(String(50))
    diagnosa_kode = Column(String(10))
    diagnosa_deskripsi = Column(String(255))
    dpjp_signature = Column(Boolean, default=False)
    nama_dpjp = Column(String(100))
    extracted_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    batch = relationship("ValidationBatch", back_populates="medical_records")

class ReferralLetter(Base):
    __tablename__ = "referral_letters"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("validation_batches.id"), nullable=False)
    no_rujukan = Column(String(50))
    diagnosa_kode = Column(String(10))
    diagnosa_deskripsi = Column(String(255))
    faskes_perujuk = Column(String(100))
    extracted_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    batch = relationship("ValidationBatch", back_populates="referral_letters")

class ValidationResult(Base):
    __tablename__ = "validation_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("validation_batches.id"), nullable=False)
    validation_type = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    batch = relationship("ValidationBatch", back_populates="validation_results")

# Pydantic Models for Request/Response
class ValidationResponse(BaseModel):
    success: bool
    message: str
    batch_id: Optional[str] = None
    validation_result: Optional[Dict[str, Any]] = None
    errors: List[str] = []
    warnings: List[str] = []

class SEPDataResponse(BaseModel):
    no_sep: str
    tgl_sep: Optional[datetime]
    no_kartu: Optional[str]
    nama_pasien: Optional[str]
    diagnosa_kode: Optional[str]
    diagnosa_deskripsi: Optional[str]

    class Config:
        from_attributes = True

class MedicalRecordResponse(BaseModel):
    no_rm: Optional[str]
    diagnosa_kode: Optional[str]
    diagnosa_deskripsi: Optional[str]
    dpjp_signature: bool
    nama_dpjp: Optional[str]

    class Config:
        from_attributes = True

class ReferralLetterResponse(BaseModel):
    no_rujukan: Optional[str]
    diagnosa_kode: Optional[str]
    diagnosa_deskripsi: Optional[str]
    faskes_perujuk: Optional[str]

    class Config:
        from_attributes = True

class ValidationDetailResponse(BaseModel):
    validation_type: str
    status: str
    details: Dict[str, Any]

    class Config:
        from_attributes = True

class ValidationSummaryResponse(BaseModel):
    batch_id: str
    filename: str
    status: str
    sep_data: Optional[SEPDataResponse] = None
    medical_record: Optional[MedicalRecordResponse] = None
    referral_letter: Optional[ReferralLetterResponse] = None
    validation_details: List[ValidationDetailResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True