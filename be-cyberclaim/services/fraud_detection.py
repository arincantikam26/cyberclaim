from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import uuid

def detect_fraud_patterns(db: Session, claim_id: uuid.UUID) -> List[Dict[str, Any]]:
    """
    Detect various fraud patterns in a claim
    """
    fraud_detections = []
    
    # Get claim data
    from app.crud.claim import get_claim
    from app.crud.fraud import create_fraud_detection
    from app.schemas.fraud import FraudDetectionCreate
    
    claim = get_claim(db, claim_id)
    if not claim:
        return fraud_detections
    
    # Pattern 1: Duplicate SEP checking
    duplicate_sep = check_duplicate_sep(db, claim.sep.sep_number, claim.patient_id)
    if duplicate_sep:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="duplicate_sep",
                risk_level="high",
                confidence=0.85,
                description=f"Duplicate SEP detected: {duplicate_sep}",
                details={"duplicate_claim_id": str(duplicate_sep)}
            )
        )
    
    # Pattern 2: Unusual billing patterns
    billing_anomaly = check_billing_anomaly(db, claim)
    if billing_anomaly:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="billing_anomaly",
                risk_level="medium",
                confidence=0.70,
                description="Unusual billing pattern detected",
                details=billing_anomaly
            )
        )
    
    # Pattern 3: Diagnosis-procedure mismatch
    diagnosis_mismatch = check_diagnosis_procedure_mismatch(claim)
    if diagnosis_mismatch:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="diagnosis_mismatch",
                risk_level="medium",
                confidence=0.75,
                description="Diagnosis and procedure mismatch detected",
                details=diagnosis_mismatch
            )
        )
    
    # Save fraud detections to database
    for detection in fraud_detections:
        create_fraud_detection(db, detection)
    
    return fraud_detections

def check_duplicate_sep(db: Session, sep_number: str, patient_id: uuid.UUID) -> uuid.UUID:
    """Check for duplicate SEP usage"""
    from app.models.claim import ClaimSubmission
    
    duplicate = db.query(ClaimSubmission).filter(
        ClaimSubmission.sep.has(sep_number=sep_number),
        ClaimSubmission.patient_id != patient_id
    ).first()
    
    return duplicate.id if duplicate else None

def check_billing_anomaly(db: Session, claim) -> Dict[str, Any]:
    """Check for unusual billing patterns"""
    # Implement billing anomaly detection logic
    # This could include:
    # - Unusually high costs for procedures
    # - Multiple claims in short time period
    # - Unusual patterns for specific diagnoses
    
    anomalies = {}
    
    # Example: Check if claim amount is significantly higher than average for similar diagnoses
    from app.models.medical import TarifINACBGS
    from app.models.claim import ClaimSubmission
    
    avg_tarif = db.query(TarifINACBGS).filter(
        TarifINACBGS.diagnosa_code == claim.sep.diagnosa_awal
    ).first()
    
    if avg_tarif:
        # Compare with average (simplified example)
        pass
    
    return anomalies if anomalies else None

def check_diagnosis_procedure_mismatch(claim) -> Dict[str, Any]:
    """Check if procedures match the diagnosis"""
    # Implement diagnosis-procedure consistency check
    # This would require a mapping of typical procedures for each diagnosis
    
    mismatches = {}
    
    # Example logic (simplified)
    if claim.rekam_medis.tindakan:
        for procedure in claim.rekam_medis.tindakan:
            # Check if procedure is typically associated with the diagnosis
            if not is_procedure_appropriate(procedure, claim.sep.diagnosa_awal):
                mismatches[procedure] = "Procedure may not be appropriate for diagnosis"
    
    return mismatches if mismatches else None

def is_procedure_appropriate(procedure: str, diagnosis: str) -> bool:
    """Check if procedure is appropriate for diagnosis"""
    # This would typically involve a database of appropriate procedures per diagnosis
    # For now, return True as placeholder
    return True