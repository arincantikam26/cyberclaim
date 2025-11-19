from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.fraud import FraudDetectionResponse, FraudDetectionCreate, FraudDetectionUpdate
from app.crud.fraud import get_fraud_detections, create_fraud_detection, update_fraud_detection, get_fraud_detections_by_claim

router = APIRouter()

@router.get("/", response_model=List[FraudDetectionResponse])
def read_fraud_detections(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detections = get_fraud_detections(db, skip=skip, limit=limit)
    return fraud_detections

@router.get("/claim/{claim_id}", response_model=List[FraudDetectionResponse])
def read_fraud_detections_by_claim(
    claim_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detections = get_fraud_detections_by_claim(db, claim_id)
    return fraud_detections

@router.post("/", response_model=FraudDetectionResponse)
def create_new_fraud_detection(
    fraud: FraudDetectionCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_fraud_detection(db=db, fraud_data=fraud)

@router.put("/{fraud_id}/resolve")
def resolve_fraud_detection(
    fraud_id: uuid.UUID,
    fraud_update: FraudDetectionUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detection = update_fraud_detection(
        db=db, 
        fraud_id=fraud_id, 
        fraud_update=fraud_update,
        resolved_by=current_user.id
    )
    
    if not fraud_detection:
        raise HTTPException(status_code=404, detail="Fraud detection not found")
    
    return {"message": "Fraud detection resolved successfully", "fraud_detection": fraud_detection}