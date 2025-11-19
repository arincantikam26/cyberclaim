from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Dict, Any

from app.database import get_db
from app.services.auth import get_current_user
from app.schemas.user import UserResponse
from app.models.claim import ClaimSubmission, ClaimStatus
from app.models.facility import Facility
from app.models.patient import Patient
from app.models.doctor import Doctor

router = APIRouter()

@router.get("/")
def get_dashboard_stats(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Base query based on user role
    base_filter = []
    
    if current_user.role.name in ["uploader", "faskes"]:
        # Facility users can only see their facility's data
        base_filter.append(ClaimSubmission.facility_id == current_user.facility_id)
    
    # Total claims by status
    claims_by_status = db.query(
        ClaimSubmission.status,
        func.count(ClaimSubmission.id).label('count')
    ).filter(*base_filter).group_by(ClaimSubmission.status).all()
    
    # Total facilities (only for admin/superadmin)
    total_facilities = 0
    if current_user.role.name in ["admin", "superadmin"]:
        total_facilities = db.query(Facility).count()
    
    # Total patients
    patient_filter = []
    if current_user.role.name in ["uploader", "faskes"]:
        # Facility users can only see patients from their claims
        patient_subquery = db.query(ClaimSubmission.patient_id).filter(
            ClaimSubmission.facility_id == current_user.facility_id
        ).subquery()
        patient_filter.append(Patient.id.in_(patient_subquery))
    
    total_patients = db.query(Patient).filter(*patient_filter).count()
    
    # Recent claims
    recent_claims = db.query(ClaimSubmission).filter(*base_filter)\
        .order_by(ClaimSubmission.upload_at.desc())\
        .limit(10)\
        .all()
    
    return {
        "claims_by_status": {status.value: count for status, count in claims_by_status},
        "total_facilities": total_facilities,
        "total_patients": total_patients,
        "recent_claims": [
            {
                "id": str(claim.id),
                "sep_number": claim.sep.sep_number,
                "patient_name": claim.patient.name,
                "facility_name": claim.facility.name,
                "upload_date": claim.upload_at,
                "status": claim.status.value
            }
            for claim in recent_claims
        ]
    }