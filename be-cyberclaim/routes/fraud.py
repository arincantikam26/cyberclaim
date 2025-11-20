from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from database import get_db
from services.auth import get_current_user
from schemas.user import UserResponse
from schemas.fraud import (
    FraudDetectionResponse, 
    FraudDetectionCreate, 
    FraudDetectionUpdate,
    FraudStatsResponse
)
from repositories.fraud import (
    get_fraud_detections, 
    create_fraud_detection, 
    update_fraud_detection, 
    get_fraud_detections_by_claim, 
    get_user_name_by_id,
    get_fraud_detection,
    get_fraud_detections_by_risk_level,
    delete_fraud_detection,
    get_fraud_statistics,
    search_fraud_detections
)

router = APIRouter()

def convert_fraud_to_response(fraud, db: Session = None):
    """Convert SQLAlchemy fraud object to response format"""
    try:
        # Safe access to nested relationships
        claim_number = "N/A"
        patient_name = "N/A"
        facility_name = "N/A"
        resolver_name = None
        
        # Access claim and its relationships safely
        if hasattr(fraud, 'claim') and fraud.claim:
            # Access SEP through claim
            if hasattr(fraud.claim, 'sep') and fraud.claim.sep and hasattr(fraud.claim.sep, 'sep_number'):
                claim_number = fraud.claim.sep.sep_number or "N/A"
            
            # Access patient through claim
            if hasattr(fraud.claim, 'patient') and fraud.claim.patient and hasattr(fraud.claim.patient, 'name'):
                patient_name = fraud.claim.patient.name or "N/A"
            
            # Access facility through claim
            if hasattr(fraud.claim, 'facility') and fraud.claim.facility and hasattr(fraud.claim.facility, 'name'):
                facility_name = fraud.claim.facility.name or "N/A"
        
        # Access resolver name
        if hasattr(fraud, 'resolved_by') and fraud.resolved_by and db:
            resolver_name = get_user_name_by_id(db, fraud.resolved_by)
        
        # Normalize values
        detection_type = fraud.detection_type
        risk_level = fraud.risk_level
        
        # Convert to lowercase untuk konsistensi
        if isinstance(detection_type, str):
            detection_type = detection_type.lower().replace(' ', '_')
        if isinstance(risk_level, str):
            risk_level = risk_level.lower()
        
        response_data = {
            "id": fraud.id,
            "claim_id": fraud.claim_id,
            "detection_type": detection_type,
            "risk_level": risk_level,
            "confidence": fraud.confidence,
            "description": fraud.description,
            "details": fraud.details,
            "is_resolved": fraud.is_resolved,
            "resolved_by": fraud.resolved_by,
            "resolved_at": fraud.resolved_at,
            "resolved_notes": fraud.resolved_notes,
            "created_at": fraud.created_at,
            "updated_at": fraud.updated_at,
            
            # Computed fields
            "claim_number": claim_number,
            "patient_name": patient_name,
            "facility_name": facility_name,
            "resolver_name": resolver_name
        }
        return FraudDetectionResponse(**response_data)
    except Exception as e:
        # Fallback response if conversion fails
        print(f"Error converting fraud to response: {e}")
        try:
            response_data = {
                "id": fraud.id,
                "claim_id": fraud.claim_id,
                "detection_type": getattr(fraud, 'detection_type', 'unknown'),
                "risk_level": getattr(fraud, 'risk_level', 'medium'),
                "confidence": getattr(fraud, 'confidence', 0.0),
                "description": getattr(fraud, 'description', ''),
                "details": getattr(fraud, 'details', {}),
                "is_resolved": getattr(fraud, 'is_resolved', False),
                "resolved_by": getattr(fraud, 'resolved_by', None),
                "resolved_at": getattr(fraud, 'resolved_at', None),
                "resolved_notes": getattr(fraud, 'resolved_notes', None),
                "created_at": getattr(fraud, 'created_at', datetime.utcnow()),
                "updated_at": getattr(fraud, 'updated_at', datetime.utcnow()),
                
                # Default computed fields
                "claim_number": "N/A",
                "patient_name": "N/A", 
                "facility_name": "N/A",
                "resolver_name": None
            }
            return FraudDetectionResponse(**response_data)
        except Exception as final_error:
            print(f"Final error in fraud conversion: {final_error}")
            return None

@router.get("/", response_model=List[FraudDetectionResponse])
def read_fraud_detections(
    skip: int = 0,
    limit: int = 100,
    resolved: Optional[bool] = Query(None, description="Filter by resolution status"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if risk_level:
        fraud_detections = get_fraud_detections_by_risk_level(db, risk_level)
    else:
        fraud_detections = get_fraud_detections(db, skip=skip, limit=limit, resolved=resolved)
    
    # Convert to response objects
    responses = []
    for fraud in fraud_detections:
        response = convert_fraud_to_response(fraud, db)
        if response:
            responses.append(response)
    
    return responses

@router.get("/stats", response_model=FraudStatsResponse)
def get_fraud_statistics(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_fraud_statistics(db)

@router.get("/search", response_model=List[FraudDetectionResponse])
def search_fraud(
    query: str = Query(..., description="Search term"),
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detections = search_fraud_detections(db, query, skip=skip, limit=limit)
    
    responses = []
    for fraud in fraud_detections:
        response = convert_fraud_to_response(fraud, db)
        if response:
            responses.append(response)
    
    return responses

@router.get("/claim/{claim_id}", response_model=List[FraudDetectionResponse])
def read_fraud_detections_by_claim(
    claim_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detections = get_fraud_detections_by_claim(db, claim_id)
    
    responses = []
    for fraud in fraud_detections:
        response = convert_fraud_to_response(fraud, db)
        if response:
            responses.append(response)
    
    return responses

@router.get("/{fraud_id}", response_model=FraudDetectionResponse)
def read_fraud_detection(
    fraud_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detection = get_fraud_detection(db, fraud_id)
    if not fraud_detection:
        raise HTTPException(status_code=404, detail="Fraud detection not found")
    
    response = convert_fraud_to_response(fraud_detection, db)
    if not response:
        raise HTTPException(status_code=500, detail="Error converting fraud detection")
    
    return response

@router.post("/", response_model=FraudDetectionResponse)
def create_new_fraud_detection(
    fraud: FraudDetectionCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    new_fraud = create_fraud_detection(db=db, fraud_data=fraud)
    
    # Reload with relationships to get computed fields
    fraud_with_relations = get_fraud_detection(db, new_fraud.id)
    
    response = convert_fraud_to_response(fraud_with_relations, db)
    if not response:
        raise HTTPException(status_code=500, detail="Error creating fraud detection")
    
    return response

@router.put("/{fraud_id}/resolve", response_model=FraudDetectionResponse)
def resolve_fraud_detection(
    fraud_id: uuid.UUID,
    fraud_update: FraudDetectionUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin", "validator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fraud_detection = update_fraud_detection(
        db=db, 
        fraud_id=fraud_id, 
        fraud_update=fraud_update,
        resolved_by=current_user.id
    )
    
    if not fraud_detection:
        raise HTTPException(status_code=404, detail="Fraud detection not found")
    
    # Reload with relationships to get computed fields
    fraud_with_relations = get_fraud_detection(db, fraud_id)
    
    response = convert_fraud_to_response(fraud_with_relations, db)
    if not response:
        raise HTTPException(status_code=500, detail="Error updating fraud detection")
    
    return response

@router.delete("/{fraud_id}")
def delete_fraud_detection(
    fraud_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = delete_fraud_detection(db, fraud_id)
    if not success:
        raise HTTPException(status_code=404, detail="Fraud detection not found")
    
    return {"message": "Fraud detection deleted successfully"}

@router.get("/debug/{fraud_id}")
def debug_fraud_detection(
    fraud_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Debug endpoint to check fraud detection relationships"""
    fraud = get_fraud_detection(db, fraud_id)
    if not fraud:
        raise HTTPException(status_code=404, detail="Fraud detection not found")
    
    return {
        "fraud_id": str(fraud.id),
        "has_claim": hasattr(fraud, 'claim') and bool(fraud.claim),
        "claim_data": {
            "id": str(fraud.claim.id) if fraud.claim else None,
            "has_patient": hasattr(fraud.claim, 'patient') and bool(fraud.claim.patient) if fraud.claim else False,
            "has_facility": hasattr(fraud.claim, 'facility') and bool(fraud.claim.facility) if fraud.claim else False,
            "has_sep": hasattr(fraud.claim, 'sep') and bool(fraud.claim.sep) if fraud.claim else False,
        },
        "has_resolver": hasattr(fraud, 'resolver') and bool(fraud.resolver),
        "raw_data": {
            "detection_type": fraud.detection_type,
            "risk_level": fraud.risk_level,
            "confidence": fraud.confidence,
            "description": fraud.description,
        }
    }