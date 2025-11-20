from sqlalchemy.orm import Session, joinedload
from datetime import datetime
import uuid
import json
from typing import List, Optional, Dict, Any
from models.claim import ClaimSubmission, ClaimFiles, ClaimStatus
from schemas.claim import ClaimSubmissionCreate, ClaimSubmissionUpdate, ClaimSubmissionResponse

# ============================================================
# FUNGSI SERIALIZATION UNTUK HANDLE DATETIME
# ============================================================

def json_serializer(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

def serialize_validation_data(data: Any) -> Dict[str, Any]:
    """Recursively serialize validation data to ensure all datetime objects are converted to strings"""
    if data is None:
        return None
    
    if isinstance(data, dict):
        return {key: serialize_validation_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize_validation_data(item) for item in data]
    elif isinstance(data, datetime):
        return data.isoformat()
    elif isinstance(data, uuid.UUID):
        return str(data)
    elif hasattr(data, 'isoformat'):  # Handle other date/time objects
        return data.isoformat()
    elif hasattr(data, '__dict__'):  # Handle objects with __dict__
        return serialize_validation_data(data.__dict__)
    else:
        return data

def safe_serialize_validation_data(data: Any) -> Dict[str, Any]:
    """Safely serialize validation data with comprehensive error handling"""
    try:
        # If it's already a string, try to parse it first
        if isinstance(data, str):
            try:
                parsed_data = json.loads(data)
                return serialize_validation_data(parsed_data)
            except:
                return {"raw_data": data}
        
        # Handle different data types
        if isinstance(data, (dict, list)):
            return serialize_validation_data(data)
        else:
            # For other types, try to convert to dict or string
            try:
                if hasattr(data, 'model_dump'):  # Pydantic v2
                    dict_data = data.model_dump()
                elif hasattr(data, 'dict'):  # Pydantic v1
                    dict_data = data.dict()
                elif hasattr(data, '__dict__'):  # Regular objects
                    dict_data = data.__dict__
                else:
                    dict_data = {"value": str(data)}
                
                return serialize_validation_data(dict_data)
            except Exception as e:
                return {
                    "error": f"Serialization failed: {str(e)}",
                    "data_type": str(type(data)),
                    "fallback_value": str(data)
                }
                
    except Exception as e:
        return {
            "error": f"Serialization error: {str(e)}",
            "data_type": str(type(data))
        }

# ============================================================
# FUNGSI CLAIM REPOSITORY
# ============================================================

def get_claim(db: Session, claim_id: uuid.UUID):
    return db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.user),
            joinedload(ClaimSubmission.patient),
            joinedload(ClaimSubmission.sep),
            joinedload(ClaimSubmission.validator),
            joinedload(ClaimSubmission.claim_files)
        )\
        .filter(ClaimSubmission.id == claim_id)\
        .first()

# Alias untuk get_claim_by_id (sama dengan get_claim)
def get_claim_by_id(db: Session, claim_id: uuid.UUID) -> Optional[ClaimSubmission]:
    """
    Get claim by ID - alias for get_claim
    """
    return get_claim(db, claim_id)

def get_claims(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.user),
            joinedload(ClaimSubmission.patient),
            joinedload(ClaimSubmission.sep),
            joinedload(ClaimSubmission.validator),
            joinedload(ClaimSubmission.claim_files)
        )\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_claims_by_facility(db: Session, facility_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.user),
            joinedload(ClaimSubmission.patient),
            joinedload(ClaimSubmission.sep),
            joinedload(ClaimSubmission.validator),
            joinedload(ClaimSubmission.claim_files)
        )\
        .filter(ClaimSubmission.facility_id == facility_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_claims_by_status(db: Session, status: ClaimStatus, skip: int = 0, limit: int = 100):
    return db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.user),
            joinedload(ClaimSubmission.patient),
            joinedload(ClaimSubmission.sep),
            joinedload(ClaimSubmission.validator),
            joinedload(ClaimSubmission.claim_files)
        )\
        .filter(ClaimSubmission.status == status)\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_claim_submission(db: Session, claim_data: ClaimSubmissionCreate, facility_id: uuid.UUID, user_id: uuid.UUID):
    """
    Create new claim submission
    """
    # Convert Pydantic model to dict and handle UUID fields
    claim_dict = claim_data.model_dump()
    
    # Create database object
    db_claim = ClaimSubmission(
        **claim_dict,
        facility_id=facility_id,
        user_id=user_id,
        upload_at=datetime.utcnow()  # Set upload timestamp
    )
    
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

def update_claim_status(db: Session, claim_id: uuid.UUID, status: ClaimStatus, validation_data: dict = None, validated_by: uuid.UUID = None):
    """
    Update claim status dengan handling enum value yang benar
    """
    db_claim = db.query(ClaimSubmission).filter(ClaimSubmission.id == claim_id).first()
    if not db_claim:
        print(f"❌ Claim {claim_id} tidak ditemukan")
        return None
    
    # DEBUG: Print enum values untuk troubleshooting
    print(f"🔄 Updating status: {status} (type: {type(status)}, value: {status.value if hasattr(status, 'value') else status})")
    
    # Pastikan kita menggunakan value string dari enum, bukan enum object
    if hasattr(status, 'value'):
        # Jika status adalah enum object, gunakan value-nya
        db_claim.status = status.value
    else:
        # Jika sudah string, gunakan langsung
        db_claim.status = status
    
    # Update timestamp untuk status tertentu
    status_str = status.value if hasattr(status, 'value') else status
    if status_str in ['validated', 'rejected', 'approved', 'menunggu_verifikasi']:
        db_claim.validated_at = datetime.utcnow()
        if validated_by:
            db_claim.validated_by = validated_by
    
    if validation_data:
        # Serialize validation data to ensure no datetime objects
        serialized_data = safe_serialize_validation_data(validation_data)
        db_claim.validation_data = serialized_data
    
    # Always update the updated_at timestamp
    db_claim.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(db_claim)
        print(f"✅ Status klaim {claim_id} diupdate ke {status_str}")
        return db_claim
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating claim status: {e}")
        
        # Debug tambahan untuk melihat enum values yang tersedia
        print("🔍 Available ClaimStatus values:")
        for status_enum in ClaimStatus:
            print(f"  - {status_enum}: {status_enum.value}")
        
        # Fallback: try without validation_data
        if validation_data:
            try:
                print("🔄 Mencoba fallback tanpa validation_data...")
                db_claim.validation_data = None
                db.commit()
                db.refresh(db_claim)
                print(f"⚠️ Claim status updated without validation data due to serialization error")
                return db_claim
            except Exception as e2:
                db.rollback()
                print(f"❌ Critical error updating claim: {e2}")
                return None
        return None

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

# Fungsi tambahan untuk fraud detection
def get_pending_verification_claims(db: Session, facility_id: uuid.UUID = None, skip: int = 0, limit: int = 100) -> List[ClaimSubmission]:
    """
    Get claims pending verification (status: MENUNGGU_VERIFIKASI)
    """
    query = db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.user),
            joinedload(ClaimSubmission.patient),
            joinedload(ClaimSubmission.sep)
        )\
        .filter(ClaimSubmission.status == ClaimStatus.MENUNGGU_VERIFIKASI)
    
    if facility_id:
        query = query.filter(ClaimSubmission.facility_id == facility_id)
    
    return query.offset(skip).limit(limit).all()

def get_patient_claim_history(db: Session, patient_id: uuid.UUID, limit: int = 10) -> List[ClaimSubmission]:
    """
    Get patient's claim history for fraud detection
    """
    return db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.sep)
        )\
        .filter(ClaimSubmission.patient_id == patient_id)\
        .order_by(ClaimSubmission.created_at.desc())\
        .limit(limit)\
        .all()

def update_claim_with_fraud_data(db: Session, claim_id: uuid.UUID, fraud_data: Dict[str, Any]) -> Optional[ClaimSubmission]:
    """
    Update claim with fraud detection results
    """
    db_claim = get_claim_by_id(db, claim_id)
    if not db_claim:
        return None
    
    # Update fraud-related fields
    if 'fraud_detections' in fraud_data:
        db_claim.fraud_detections = fraud_data['fraud_detections']
    
    if 'fraud_checked_at' in fraud_data:
        db_claim.fraud_checked_at = fraud_data['fraud_checked_at']
    
    if 'fraud_risk_level' in fraud_data:
        db_claim.fraud_risk_level = fraud_data['fraud_risk_level']
    
    if 'extracted_data' in fraud_data:
        # Serialize extracted data to prevent JSON issues
        serialized_data = safe_serialize_validation_data(fraud_data['extracted_data'])
        db_claim.extracted_data = serialized_data
    
    db_claim.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(db_claim)
        return db_claim
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating claim with fraud data: {e}")
        return None

def get_claims_by_date_range(db: Session, start_date: datetime, end_date: datetime, facility_id: uuid.UUID = None) -> List[ClaimSubmission]:
    """
    Get claims within date range for reporting
    """
    query = db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.patient)
        )\
        .filter(
            ClaimSubmission.created_at >= start_date,
            ClaimSubmission.created_at <= end_date
        )
    
    if facility_id:
        query = query.filter(ClaimSubmission.facility_id == facility_id)
    
    return query.order_by(ClaimSubmission.created_at.desc()).all()

def get_claim_statistics(db: Session, facility_id: uuid.UUID = None) -> Dict[str, Any]:
    """
    Get claim statistics for dashboard
    """
    from sqlalchemy import func
    
    query = db.query(ClaimSubmission)
    
    if facility_id:
        query = query.filter(ClaimSubmission.facility_id == facility_id)
    
    total_claims = query.count()
    
    # Count by status
    status_counts = {}
    for status in ClaimStatus:
        count = query.filter(ClaimSubmission.status == status).count()
        status_counts[status.value] = count
    
    # Today's claims
    today = datetime.utcnow().date()
    today_start = datetime(today.year, today.month, today.day)
    today_end = datetime(today.year, today.month, today.day, 23, 59, 59)
    
    today_claims = query.filter(
        ClaimSubmission.created_at >= today_start,
        ClaimSubmission.created_at <= today_end
    ).count()
    
    return {
        "total_claims": total_claims,
        "status_counts": status_counts,
        "today_claims": today_claims,
        "facility_id": facility_id
    }

def update_claim_validation_data(db: Session, claim_id: uuid.UUID, validation_data: Dict[str, Any]) -> Optional[ClaimSubmission]:
    """
    Update validation data for a claim
    """
    db_claim = get_claim_by_id(db, claim_id)
    if not db_claim:
        return None
    
    # Serialize validation data
    serialized_data = safe_serialize_validation_data(validation_data)
    db_claim.validation_data = serialized_data
    db_claim.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(db_claim)
        return db_claim
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating claim validation data: {e}")
        return None

def get_claims_with_fraud_risk(db: Session, risk_level: str = None, facility_id: uuid.UUID = None, skip: int = 0, limit: int = 100) -> List[ClaimSubmission]:
    """
    Get claims with fraud risk level
    """
    query = db.query(ClaimSubmission)\
        .options(
            joinedload(ClaimSubmission.facility),
            joinedload(ClaimSubmission.patient)
        )
    
    if risk_level:
        query = query.filter(ClaimSubmission.fraud_risk_level == risk_level)
    
    if facility_id:
        query = query.filter(ClaimSubmission.facility_id == facility_id)
    
    return query.offset(skip).limit(limit).all()

# ============================================================
# FUNGSI UTILITY UNTUK TESTING
# ============================================================

def test_serialization():
    """Test function to verify serialization works"""
    test_data = {
        "valid": True,
        "message": "Test message",
        "timestamp": datetime.utcnow(),  # This should be serialized
        "nested": {
            "date_field": datetime.now(),
            "regular_field": "test"
        },
        "list_with_dates": [datetime.now(), "string_item", 123]
    }
    
    print("🧪 Testing serialization...")
    serialized = safe_serialize_validation_data(test_data)
    print("Original data types:")
    for key, value in test_data.items():
        print(f"  {key}: {type(value)}")
    
    print("\nSerialized data types:")
    for key, value in serialized.items():
        print(f"  {key}: {type(value)}")
    
    # Try to convert to JSON
    try:
        json_str = json.dumps(serialized, indent=2)
        print("✅ JSON serialization successful")
        return True
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        return False

# Uncomment to test serialization
# test_serialization()