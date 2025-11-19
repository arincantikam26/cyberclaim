from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
import enum
from app.database import Base
from sqlalchemy.dialects.postgresql import JSON


class ClaimStatus(enum.Enum):
    UPLOADED = "uploaded"
    VALIDATED = "validated"
    FRAUD_CHECK = "fraud_check"
    REJECTED = "rejected"
    APPROVED = "approved"

class ClaimSubmission(Base):
    __tablename__ = "claim_submission"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    sep_id = Column(UUID(as_uuid=True), ForeignKey("sep.id"), nullable=False)
    rm_id = Column(UUID(as_uuid=True), ForeignKey("rekam_medis.id"), nullable=False)
    rar_file_path = Column(String(500), nullable=False)
    upload_at = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLEnum(ClaimStatus), default=ClaimStatus.UPLOADED)
    notes = Column(Text)
    validated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    validated_at = Column(DateTime)
    validation_data = Column(JSON)  # Store SEP validation results
    
    # Relationships
    facility = relationship("Facility", back_populates="claim_submissions")
    user = relationship("User", back_populates="claim_submissions", foreign_keys=[user_id])
    patient = relationship("Patient", back_populates="claim_submissions")
    sep = relationship("SEP", back_populates="claim_submissions")
    rekam_medis = relationship("RekamMedis", back_populates="claim_submissions")
    validator = relationship("User", foreign_keys=[validated_by])
    claim_files = relationship("ClaimFiles", back_populates="claim")
    fraud_detections = relationship("FraudDetection", back_populates="claim")

class ClaimFiles(Base):
    __tablename__ = "claim_files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claim_submission.id"), nullable=False)
    file_type = Column(String(50), nullable=False)  # sep, rm, rujukan, ktp, kartu
    file_path = Column(String(500), nullable=False)
    checksum = Column(String(64), nullable=False)  # SHA256 checksum
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    claim = relationship("ClaimSubmission", back_populates="claim_files")