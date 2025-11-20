from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from services.auth import get_current_user
from schemas.user import UserResponse
from schemas.medical import DiagnosisResponse, TindakanResponse, TarifINACBGSResponse, DiagnosisBase, TindakanBase, TarifINACBGSBase
from repositories.medical import (
    get_diagnoses, create_diagnosis, get_tindakans, create_tindakan,
    get_tarif_inacbgs_list, create_tarif_inacbgs, update_tarif_inacbgs
)

# Tambahkan imports tambahan
from repositories.tariff import (
    calculate_tariff_for_claim, 
    get_tariff_comparison,
    get_tariff_statistics,
    validate_diagnosis_tariff
)


router = APIRouter()

# Diagnosis Routes
@router.get("/diagnosis/", response_model=List[DiagnosisResponse])
def read_diagnoses(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_diagnoses(db, skip=skip, limit=limit)

@router.post("/diagnosis/", response_model=DiagnosisResponse)
def create_new_diagnosis(
    diagnosis: DiagnosisBase,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_diagnosis(db=db, diagnosis=diagnosis)

# Tindakan Routes
@router.get("/tindakan/", response_model=List[TindakanResponse])
def read_tindakans(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_tindakans(db, skip=skip, limit=limit)

@router.post("/tindakan/", response_model=TindakanResponse)
def create_new_tindakan(
    tindakan: TindakanBase,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_tindakan(db=db, tindakan=tindakan)

# Tarif INACBGS Routes
@router.get("/tarif-inacbgs/", response_model=List[TarifINACBGSResponse])
def read_tarif_inacbgs(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_tarif_inacbgs_list(db, skip=skip, limit=limit)

@router.post("/tarif-inacbgs/", response_model=TarifINACBGSResponse)
def create_new_tarif_inacbgs(
    tarif: TarifINACBGSBase,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_tarif_inacbgs(db=db, tarif=tarif)

@router.put("/tarif-inacbgs/{tarif_id}", response_model=TarifINACBGSResponse)
def update_tarif_inacbgs_info(
    tarif_id: uuid.UUID,
    tarif_update: TarifINACBGSBase,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    from repositories.medical import update_tarif_inacbgs
    tarif = update_tarif_inacbgs(db=db, tarif_id=tarif_id, tarif_update=tarif_update)
    if not tarif:
        raise HTTPException(status_code=404, detail="Tarif INACBGS not found")
    return tarif


# Tambahkan routes baru untuk fraud detection
@router.post("/tarif-inacbgs/calculate-claim")
def calculate_claim_tariff(
    diagnosis_code: str = Query(..., description="Kode diagnosa ICD-10"),
    procedures: List[str] = Query(None, description="List kode prosedur ICD-9"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate standard tariff for a claim
    """
    if current_user.role.name not in ["admin", "superadmin", "verifikator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = calculate_tariff_for_claim(db, diagnosis_code, procedures)
    return result


@router.post("/tarif-inacbgs/compare-claim")
def compare_claim_tariff(
    claimed_amount: float = Query(..., description="Jumlah yang diklaim"),
    diagnosis_code: str = Query(..., description="Kode diagnosa ICD-10"),
    procedures: List[str] = Query(None, description="List kode prosedur ICD-9"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compare claimed amount with standard tariff for fraud detection
    """
    if current_user.role.name not in ["admin", "superadmin", "verifikator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = get_tariff_comparison(db, claimed_amount, diagnosis_code, procedures)
    return result


@router.get("/tarif-inacbgs/statistics")
def get_tariff_stats(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tariff statistics
    """
    if current_user.role.name not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_tariff_statistics(db)


@router.post("/tarif-inacbgs/validate-diagnosis")
def validate_diagnosis_claim(
    diagnosis_code: str = Query(..., description="Kode diagnosa ICD-10"),
    claimed_amount: float = Query(..., description="Jumlah yang diklaim"),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Validate if claimed amount is reasonable for a diagnosis
    """
    if current_user.role.name not in ["admin", "superadmin", "verifikator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = validate_diagnosis_tariff(db, diagnosis_code, claimed_amount)
    return result