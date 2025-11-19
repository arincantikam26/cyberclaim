from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base

class JenisSarana(Base):
    __tablename__ = "jenis_sarana"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(10), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    facilities = relationship("Facility", back_populates="jenis_sarana")

class Facility(Base):
    __tablename__ = "facilities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(8), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    telp = Column(String(20))
    website = Column(String(100))
    address = Column(Text)
    province = Column(String(50))
    city = Column(String(50))
    jenis_sarana_id = Column(Integer, ForeignKey("jenis_sarana.id"), nullable=False)
    operasional = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    jenis_sarana = relationship("JenisSarana", back_populates="facilities")
    users = relationship("User", back_populates="facility")
    doctors = relationship("Doctor", back_populates="facility")
    sep_records = relationship("SEP", back_populates="facility")
    claim_submissions = relationship("ClaimSubmission", back_populates="facility")