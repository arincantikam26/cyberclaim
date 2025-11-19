from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.models.claim import ClaimSubmission, ClaimFiles
from app.schemas.claim import ClaimSubmissionCreate, ClaimSubmissionUpdate

def get_claim(db: Session, claim_id: uuid.UUID):
    return db.query(ClaimSubmission).filter(ClaimSubmission.id == claim_id).first()

def get_claims(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission).offset(skip).limit(limit).all()

def get_claims_by_facility(db: Session, facility_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission).filter(ClaimSubmission.facility_id == facility_id)\
        .offset(skip).limit(limit).all()

def get_claims_by_status(db: Session, status: str, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission).filter(ClaimSubmission.status == status)\
        .offset(skip).limit(limit).all()

def create_claim_submission(db: Session, claim_data: ClaimSubmissionCreate, facility_id: uuid.UUID, user_id: uuid.UUID):
    db_claim = ClaimSubmission(
        **claim_data.dict(),
        facility_id=facility_id,
        user_id=user_id
    )
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

def update_claim_status(db: Session, claim_id: uuid.UUID, status: str, validation_data: dict = None):
    db_claim = db.query(ClaimSubmission).filter(ClaimSubmission.id == claim_id).first()
    if not db_claim:
        return None
    
    db_claim.status = status
    if status == "validated" or status == "rejected":
        db_claim.validated_at = datetime.utcnow()
    if validation_data:
        db_claim.validation_data = validation_data
    
    db.commit()
    db.refresh(db_claim)
    return db_claim

def add_claim_file(db: Session, claim_id: uuid.UUID, file_type: str, file_path: str, checksum: str):
    db_file = ClaimFiles(
        claim_id=claim_id,
        file_type=file_type,
        file_path=file_path,
        checksum=checksum
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file