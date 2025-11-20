from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base

class Diagnosis(Base):
    __tablename__ = "diagnosis"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    sep_diagnosis = relationship("SEP", back_populates="diagnosis_awal_rel", foreign_keys="SEP.diagnosa_awal")
    medical_diagnosis = relationship("RekamMedis", back_populates="diagnosis_utama_rel", foreign_keys="RekamMedis.diagnosa_utama")

class Tindakan(Base):
    __tablename__ = "tindakan"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TarifINACBGS(Base):
    __tablename__ = "tarif_inacbgs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    diagnosa_code = Column(String(20), ForeignKey("diagnosis.code"), nullable=False)
    description = Column(String(255))
    tarif_inacbgs = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    diagnosis = relationship("Diagnosis")

class SEP(Base):
    __tablename__ = "sep"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sep_number = Column(String(50), unique=True, nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    diagnosa_awal = Column(String(20), ForeignKey("diagnosis.code"), nullable=False)
    diagnosa_utama = Column(String(255))
    poli = Column(String(100))
    kelas_rawat = Column(String(50))
    penjamin = Column(String(100))
    sep_date = Column(Date, nullable=False)
    rujukan_facility = Column(String(150))
    qr_code_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="sep_records")
    facility = relationship("Facility", back_populates="sep_records")
    doctor = relationship("Doctor", back_populates="sep_records")
    diagnosis_awal_rel = relationship("Diagnosis", back_populates="sep_diagnosis")
    medical_records = relationship("RekamMedis", back_populates="sep")
    claim_submissions = relationship("ClaimSubmission", back_populates="sep")

class RekamMedis(Base):
    __tablename__ = "rekam_medis"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    sep_id = Column(UUID(as_uuid=True), ForeignKey("sep.id"), nullable=False)
    dokter_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    tanggal_masuk = Column(DateTime, nullable=False)
    tanggal_keluar = Column(DateTime)
    diagnosa_masuk = Column(String(255))
    diagnosa_utama = Column(String(20), ForeignKey("diagnosis.code"), nullable=False)
    diagnosa_sekunder = Column(JSON)  # Array of diagnosis codes
    tindakan = Column(JSON)  # Array of procedure codes
    komplikasi = Column(Text)
    alergi = Column(String(255))
    icd_x = Column(String(20))
    berkas_path = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
    sep = relationship("SEP", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
    diagnosis_utama_rel = relationship("Diagnosis", back_populates="medical_diagnosis")
    claim_submissions = relationship("ClaimSubmission", back_populates="rekam_medis")