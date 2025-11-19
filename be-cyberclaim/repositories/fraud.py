from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.models.fraud import FraudDetection
from app.schemas.fraud import FraudDetectionCreate, FraudDetectionUpdate

def get_fraud_detection(db: Session, fraud_id: uuid.UUID):
    return db.query(FraudDetection).filter(FraudDetection.id == fraud_id).first()

def get_fraud_detections(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FraudDetection).offset(skip).limit(limit).all()

def get_fraud_detections_by_claim(db: Session, claim_id: uuid.UUID):
    return db.query(FraudDetection).filter(FraudDetection.claim_id == claim_id).all()

def create_fraud_detection(db: Session, fraud_data: FraudDetectionCreate):
    db_fraud = FraudDetection(**fraud_data.dict())
    db.add(db_fraud)
    db.commit()
    db.refresh(db_fraud)
    return db_fraud

def update_fraud_detection(db: Session, fraud_id: uuid.UUID, fraud_update: FraudDetectionUpdate, resolved_by: uuid.UUID = None):
    db_fraud = db.query(FraudDetection).filter(FraudDetection.id == fraud_id).first()
    if not db_fraud:
        return None
    
    update_data = fraud_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_fraud, field, value)
    
    if fraud_update.is_resolved and not db_fraud.resolved_at:
        db_fraud.resolved_at = datetime.utcnow()
        db_fraud.resolved_by = resolved_by
    
    db.commit()
    db.refresh(db_fraud)
    return db_fraud