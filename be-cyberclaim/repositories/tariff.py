from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy import func

from models.medical import TarifINACBGS
from schemas.medical import TarifINACBGSBase, TarifINACBGSUpdate


def get_tariff_by_id(db: Session, tariff_id: UUID) -> Optional[TarifINACBGS]:
    """
    Get tariff by ID
    """
    return db.query(TarifINACBGS).filter(TarifINACBGS.id == tariff_id).first()


def get_tariff_by_diagnosis(db: Session, diagnosis_code: str) -> Optional[TarifINACBGS]:
    """
    Get tariff by diagnosis code (ICD-10)
    """
    return db.query(TarifINACBGS).filter(
        TarifINACBGS.diagnosa_code == diagnosis_code
    ).first()


def get_tariff_by_diagnosis_procedure(db: Session, diagnosis_code: str, procedure_code: Optional[str] = None) -> Optional[TarifINACBGS]:
    """
    Get tariff by diagnosis and procedure combination
    """
    query = db.query(TarifINACBGS).filter(
        TarifINACBGS.diagnosa_code == diagnosis_code
    )
    
    # Untuk base tariff diagnosis saja (tanpa procedure)
    if not procedure_code:
        return query.filter(TarifINACBGS.is_active == True).first()
    
    return query.first()


def calculate_tariff_for_claim(db: Session, diagnosis_code: str, procedures: List[str] = None) -> Dict[str, Any]:
    """
    Calculate total tariff for a claim based on diagnosis and procedures
    """
    total_tariff = 0
    tariff_details = []
    
    # Get base tariff for diagnosis
    base_tariff = get_tariff_by_diagnosis_procedure(db, diagnosis_code, None)
    
    if base_tariff:
        total_tariff += base_tariff.tarif_inacbgs
        tariff_details.append({
            "type": "diagnosis",
            "code": diagnosis_code,
            "description": base_tariff.description or "Base diagnosis tariff",
            "tariff": base_tariff.tarif_inacbgs
        })
    
    # Add tariffs for procedures (simplified - dalam implementasi real perlu mapping procedure ke tariff)
    if procedures:
        for procedure in procedures:
            # Untuk sementara, kita asumsikan setiap procedure menambah fixed amount
            # Dalam implementasi real, perlu query tariff untuk setiap procedure
            procedure_tariff = 50000  # Contoh fixed amount
            total_tariff += procedure_tariff
            tariff_details.append({
                "type": "procedure",
                "code": procedure,
                "description": f"Procedure: {procedure}",
                "tariff": procedure_tariff
            })
    
    return {
        "total_tariff": total_tariff,
        "tariff_details": tariff_details,
        "diagnosis_code": diagnosis_code,
        "procedure_count": len(procedures) if procedures else 0
    }


def get_tariff_comparison(db: Session, claimed_amount: float, diagnosis_code: str, procedures: List[str] = None) -> Dict[str, Any]:
    """
    Compare claimed amount with standard tariff for fraud detection
    """
    standard_tariff = calculate_tariff_for_claim(db, diagnosis_code, procedures)
    
    variance = 0
    variance_percent = 0
    
    if standard_tariff["total_tariff"] > 0:
        variance = claimed_amount - standard_tariff["total_tariff"]
        variance_percent = (variance / standard_tariff["total_tariff"]) * 100
    
    # Determine fraud risk level
    if abs(variance_percent) > 50:
        risk_level = "high"
    elif abs(variance_percent) > 30:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return {
        "claimed_amount": claimed_amount,
        "standard_amount": standard_tariff["total_tariff"],
        "variance": variance,
        "variance_percent": variance_percent,
        "risk_level": risk_level,
        "is_within_threshold": abs(variance_percent) <= 30,
        "tariff_details": standard_tariff["tariff_details"]
    }


def validate_diagnosis_tariff(db: Session, diagnosis_code: str, claimed_amount: float) -> Dict[str, Any]:
    """
    Validate if claimed amount is reasonable for a diagnosis
    """
    tariff = get_tariff_by_diagnosis(db, diagnosis_code)
    
    if not tariff:
        return {
            "valid": False,
            "reason": f"Diagnosis code {diagnosis_code} not found in tariff database",
            "risk_level": "high"
        }
    
    variance_percent = ((claimed_amount - tariff.tarif_inacbgs) / tariff.tarif_inacbgs) * 100
    
    if abs(variance_percent) > 50:
        risk_level = "high"
        valid = False
    elif abs(variance_percent) > 30:
        risk_level = "medium"
        valid = False
    else:
        risk_level = "low"
        valid = True
    
    return {
        "valid": valid,
        "standard_tariff": tariff.tarif_inacbgs,
        "claimed_amount": claimed_amount,
        "variance_percent": variance_percent,
        "risk_level": risk_level,
        "diagnosis_description": tariff.description or "No description available"
    }


# Tambahkan fungsi yang missing
def get_tariff_statistics(db: Session) -> Dict[str, Any]:
    """
    Get tariff statistics for dashboard
    """
    total_tariffs = db.query(TarifINACBGS).count()
    
    # Count active tariffs
    active_tariffs = db.query(TarifINACBGS).filter(TarifINACBGS.is_active == True).count()
    
    # Average tariff
    avg_tariff = db.query(func.avg(TarifINACBGS.tarif_inacbgs)).scalar() or 0
    
    # Min and max tariff
    min_tariff = db.query(func.min(TarifINACBGS.tarif_inacbgs)).scalar() or 0
    max_tariff = db.query(func.max(TarifINACBGS.tarif_inacbgs)).scalar() or 0
    
    # Count by diagnosis categories (contoh sederhana)
    common_diagnoses = db.query(
        TarifINACBGS.diagnosa_code,
        func.count(TarifINACBGS.id).label('count')
    ).group_by(TarifINACBGS.diagnosa_code).order_by(func.count(TarifINACBGS.id).desc()).limit(5).all()
    
    return {
        "total_tariffs": total_tariffs,
        "active_tariffs": active_tariffs,
        "inactive_tariffs": total_tariffs - active_tariffs,
        "average_tariff": float(avg_tariff),
        "min_tariff": float(min_tariff),
        "max_tariff": float(max_tariff),
        "common_diagnoses": [{"code": code, "count": count} for code, count in common_diagnoses]
    }


def search_tariffs_by_diagnosis(db: Session, search_term: str) -> List[TarifINACBGS]:
    """
    Search tariffs by diagnosis description or code
    """
    return db.query(TarifINACBGS).filter(
        (TarifINACBGS.diagnosa_code.ilike(f"%{search_term}%")) |
        (TarifINACBGS.description.ilike(f"%{search_term}%"))
    ).all()


def get_tariffs_by_diagnosis_group(db: Session, diagnosis_group: str) -> List[TarifINACBGS]:
    """
    Get all tariffs by diagnosis group
    """
    # Untuk sementara, kita gunakan prefix kode diagnosa sebagai group
    # Contoh: A00-A09 -> group "A"
    return db.query(TarifINACBGS).filter(
        TarifINACBGS.diagnosa_code.startswith(diagnosis_group)
    ).all()


def get_common_diagnosis_tariffs(db: Session, limit: int = 10) -> List[TarifINACBGS]:
    """
    Get most common diagnosis tariffs
    """
    return db.query(TarifINACBGS).filter(
        TarifINACBGS.is_active == True
    ).order_by(TarifINACBGS.tarif_inacbgs.desc()).limit(limit).all()