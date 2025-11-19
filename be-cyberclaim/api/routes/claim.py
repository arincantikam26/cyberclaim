from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.schemas.claim import ClaimSubmissionResponse, ClaimSubmissionUpdate
from app.crud.claim import get_claim, get_claims, update_claim_status

router = APIRouter()

@router.get("/", response_model=List[ClaimSubmissionResponse])
def read_claims(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name in ["admin", "superadmin"]:
        claims = get_claims(db, skip=skip, limit=limit)
    else:
        from app.crud.claim import get_claims_by_facility
        claims = get_claims_by_facility(db, current_user.facility_id, skip=skip, limit=limit)
    
    return claims

@router.get("/{claim_id}", response_model=ClaimSubmissionResponse)
def read_claim(
    claim_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and claim.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return claim

@router.put("/{claim_id}/validate")
def validate_claim(
    claim_id: uuid.UUID,
    action: str,  # approve or reject
    notes: str = None,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    if action == "approve":
        new_status = "approved"
    elif action == "reject":
        new_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'")
    
    updated_claim = update_claim_status(
        db=db, 
        claim_id=claim_id, 
        status=new_status,
        validation_data={"validator_id": str(current_user.id), "notes": notes}
    )
    
    return {"message": f"Claim {action}d successfully", "claim": updated_claim}

@router.put("/{claim_id}/fraud-check")
def mark_for_fraud_check(
    claim_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    updated_claim = update_claim_status(db=db, claim_id=claim_id, status="fraud_check")
    
    return {"message": "Claim marked for fraud check", "claim": updated_claim}