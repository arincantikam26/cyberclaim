from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)  # 'male', 'female'
    telp = Column(String(20))
    address = Column(Text)
    nik = Column(String(16), unique=True)
    bpjs_number = Column(String(13), unique=True)
    membership_json = Column(JSON)  # Additional BPJS membership data
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sep_records = relationship("SEP", back_populates="patient")
    medical_records = relationship("RekamMedis", back_populates="patient")
    claim_submissions = relationship("ClaimSubmission", back_populates="patient")
