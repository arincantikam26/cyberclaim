from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base

class FraudDetection(Base):
    __tablename__ = "fraud_detections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claim_submission.id"), nullable=False)
    detection_type = Column(String(100), nullable=False)  # duplicate, manipulation, fictitious, upcoding
    risk_level = Column(String(20))  # low, medium, high, critical
    confidence = Column(Float)  # 0-1 confidence score
    description = Column(Text)
    details = Column(JSON)  # Detailed detection data
    is_resolved = Column(Boolean, default=False)
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    resolved_at = Column(DateTime)
    resolved_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    claim = relationship("ClaimSubmission", back_populates="fraud_detections")
    resolver = relationship("User", foreign_keys=[resolved_by])