from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, case
from datetime import datetime
import uuid
from typing import Dict, Any ,List

from models.fraud import FraudDetection
from models.claim import ClaimSubmission
from models.user import User
from schemas.fraud import FraudDetectionCreate, FraudDetectionUpdate, FraudStatsResponse

def get_fraud_detection(db: Session, fraud_id: uuid.UUID):
    return db.query(FraudDetection)\
        .options(
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.patient),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.facility),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.sep),
            joinedload(FraudDetection.resolver)
        )\
        .filter(FraudDetection.id == fraud_id)\
        .first()

def get_fraud_detections(db: Session, skip: int = 0, limit: int = 100, resolved: bool = None):
    query = db.query(FraudDetection)\
        .options(
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.patient),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.facility),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.sep),
            joinedload(FraudDetection.resolver)
        )
    
    if resolved is not None:
        query = query.filter(FraudDetection.is_resolved == resolved)
    
    return query.offset(skip).limit(limit).all()

def get_fraud_detections_by_claim(db: Session, claim_id: uuid.UUID):
    return db.query(FraudDetection)\
        .options(
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.patient),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.facility),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.sep),
            joinedload(FraudDetection.resolver)
        )\
        .filter(FraudDetection.claim_id == claim_id)\
        .all()

def get_fraud_detections_by_risk_level(db: Session, risk_level: str):
    return db.query(FraudDetection)\
        .options(
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.patient),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.facility),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.sep),
            joinedload(FraudDetection.resolver)
        )\
        .filter(FraudDetection.risk_level == risk_level)\
        .all()

def create_fraud_detection(db: Session, fraud_data: FraudDetectionCreate):
    db_fraud = FraudDetection(**fraud_data.dict())
    db.add(db_fraud)
    db.commit()
    db.refresh(db_fraud)
    return db_fraud

def create_bulk_fraud_detections(db: Session, fraud_data_list: List[FraudDetectionCreate]):
    db_frauds = [FraudDetection(**fraud_data.dict()) for fraud_data in fraud_data_list]
    db.add_all(db_frauds)
    db.commit()
    for fraud in db_frauds:
        db.refresh(fraud)
    return db_frauds

def update_fraud_detection(db: Session, fraud_id: uuid.UUID, fraud_update: FraudDetectionUpdate, resolved_by: uuid.UUID = None):
    db_fraud = db.query(FraudDetection).filter(FraudDetection.id == fraud_id).first()
    if not db_fraud:
        return None
    
    update_data = fraud_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_fraud, field, value)
    
    # Handle resolution
    if fraud_update.is_resolved and not db_fraud.resolved_at:
        db_fraud.resolved_at = datetime.utcnow()
        db_fraud.resolved_by = resolved_by
    elif fraud_update.is_resolved is False:
        db_fraud.resolved_at = None
        db_fraud.resolved_by = None
        db_fraud.resolved_notes = None
    
    db.commit()
    db.refresh(db_fraud)
    return db_fraud

def delete_fraud_detection(db: Session, fraud_id: uuid.UUID):
    db_fraud = db.query(FraudDetection).filter(FraudDetection.id == fraud_id).first()
    if not db_fraud:
        return False
    
    db.delete(db_fraud)
    db.commit()
    return True

def get_fraud_statistics(db: Session) -> FraudStatsResponse:
    # Total counts
    total = db.query(func.count(FraudDetection.id)).scalar()
    resolved = db.query(func.count(FraudDetection.id)).filter(FraudDetection.is_resolved == True).scalar()
    unresolved = db.query(func.count(FraudDetection.id)).filter(FraudDetection.is_resolved == False).scalar()
    
    # Count by risk level
    risk_level_counts = db.query(
        FraudDetection.risk_level,
        func.count(FraudDetection.id)
    ).group_by(FraudDetection.risk_level).all()
    
    # Count by detection type
    detection_type_counts = db.query(
        FraudDetection.detection_type,
        func.count(FraudDetection.id)
    ).group_by(FraudDetection.detection_type).all()
    
    # High confidence detections (confidence > 0.8)
    high_confidence = db.query(func.count(FraudDetection.id)).filter(FraudDetection.confidence > 0.8).scalar()
    
    return FraudStatsResponse(
        total_detections=total or 0,
        resolved_count=resolved or 0,
        unresolved_count=unresolved or 0,
        by_risk_level=dict(risk_level_counts) if risk_level_counts else {},
        by_detection_type=dict(detection_type_counts) if detection_type_counts else {},
        high_confidence_count=high_confidence or 0
    )

def get_user_name_by_id(db: Session, user_id: uuid.UUID):
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        return user.full_name if user else None
    return None

def search_fraud_detections(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(FraudDetection)\
        .options(
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.patient),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.facility),
            joinedload(FraudDetection.claim).joinedload(ClaimSubmission.sep),
            joinedload(FraudDetection.resolver)
        )\
        .filter(
            FraudDetection.description.ilike(f"%{query}%") |
            FraudDetection.detection_type.ilike(f"%{query}%")
        )\
        .offset(skip)\
        .limit(limit)\
        .all()