from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from services.auth import get_current_user
from schemas.user import UserResponse
from schemas.medical import SEPResponse, RekamMedisResponse, SEPCreate, RekamMedisCreate
from repositories.medical import get_sep, get_seps, create_sep, get_medical_record, get_medical_records, create_medical_record
from models.medical import SEP, RekamMedis

router = APIRouter()

# Helper function untuk diagnosis name
def get_diagnosis_name(diagnosis_code: str) -> str:
    diagnosis_map = {
        "I10": "Hipertensi Esensial",
        "E11": "Diabetes Mellitus Tipe 2", 
        "J18": "Pneumonia",
        "K29": "Gastritis dan Duodenitis",
        "A00": "Kolera"
    }
    return diagnosis_map.get(diagnosis_code, "Unknown Diagnosis")

@router.get("/sep/", response_model=List[SEPResponse])
def read_sep_list(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ✅ PERBAIKAN: Gunakan get_seps (bukan get_sep_list)
    sep_list = get_seps(db, skip=skip, limit=limit, search=search)
    
    # Manual mapping untuk SEP
    sep_responses = []
    for sep in sep_list:
        sep_data = {
            "id": sep.id,
            "sep_number": sep.sep_number,
            "patient_id": sep.patient_id,
            "facility_id": sep.facility_id,
            "doctor_id": sep.doctor_id,
            "diagnosa_awal": sep.diagnosa_awal,
            "diagnosa_utama": sep.diagnosa_utama,
            "poli": sep.poli,
            "kelas_rawat": sep.kelas_rawat,
            "penjamin": sep.penjamin,
            "sep_date": sep.sep_date,
            "rujukan_facility": sep.rujukan_facility,
            "qr_code_hash": sep.qr_code_hash,
            "created_at": sep.created_at,
            "updated_at": sep.updated_at,
            # Manual mapping untuk relationship fields
            "patient_name": sep.patient.name if sep.patient else "Unknown Patient",
            "facility_name": sep.facility.name if sep.facility else "Unknown Facility",
            "doctor_name": sep.doctor.name if sep.doctor else "Unknown Doctor",
            "diagnosis_name": get_diagnosis_name(sep.diagnosa_awal)
        }
        sep_responses.append(sep_data)
    
    return sep_responses

@router.get("/sep/{sep_id}", response_model=SEPResponse)
def read_sep(
    sep_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sep = get_sep(db, sep_id)
    if not sep:
        raise HTTPException(status_code=404, detail="SEP not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and sep.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Manual mapping untuk single SEP juga
    sep_data = {
        "id": sep.id,
        "sep_number": sep.sep_number,
        "patient_id": sep.patient_id,
        "facility_id": sep.facility_id,
        "doctor_id": sep.doctor_id,
        "diagnosa_awal": sep.diagnosa_awal,
        "diagnosa_utama": sep.diagnosa_utama,
        "poli": sep.poli,
        "kelas_rawat": sep.kelas_rawat,
        "penjamin": sep.penjamin,
        "sep_date": sep.sep_date,
        "rujukan_facility": sep.rujukan_facility,
        "qr_code_hash": sep.qr_code_hash,
        "created_at": sep.created_at,
        "updated_at": sep.updated_at,
        "patient_name": sep.patient.name if sep.patient else "Unknown Patient",
        "facility_name": sep.facility.name if sep.facility else "Unknown Facility",
        "doctor_name": sep.doctor.name if sep.doctor else "Unknown Doctor",
        "diagnosis_name": get_diagnosis_name(sep.diagnosa_awal)
    }
    
    return sep_data

@router.post("/sep/", response_model=SEPResponse)
def create_new_sep(
    sep: SEPCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Facility users can only create SEP for their facility
    if current_user.role.name in ["uploader", "faskes"]:
        sep.facility_id = current_user.facility_id
    
    return create_sep(db=db, sep=sep)

@router.get("/rekam-medis/", response_model=List[RekamMedisResponse])
def read_medical_records(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.name in ["uploader", "faskes"]:
        # Hanya rekam medis dari facility yang sama melalui SEP
        medical_records = db.query(RekamMedis).join(SEP).filter(
            SEP.facility_id == current_user.facility_id
        ).offset(skip).limit(limit).all()
    else:
        # Admin dan superadmin bisa lihat semua
        medical_records = get_medical_records(db, skip=skip, limit=limit)
    
    # Manual mapping untuk RekamMedis
    rm_responses = []
    for rm in medical_records:
        rm_data = {
            "id": rm.id,
            "patient_id": rm.patient_id,
            "sep_id": rm.sep_id,
            "dokter_id": rm.dokter_id,
            "tanggal_masuk": rm.tanggal_masuk,
            "tanggal_keluar": rm.tanggal_keluar,
            "diagnosa_masuk": rm.diagnosa_masuk,
            "diagnosa_utama": rm.diagnosa_utama,
            "diagnosa_sekunder": rm.diagnosa_sekunder,
            "tindakan": rm.tindakan,
            "komplikasi": rm.komplikasi,
            "alergi": rm.alergi,
            "icd_x": rm.icd_x,
            "berkas_path": rm.berkas_path,
            "created_at": rm.created_at,
            "updated_at": rm.updated_at,
            "patient_name": rm.patient.name if rm.patient else "Unknown Patient",
            "sep_number": rm.sep.sep_number if rm.sep else "Unknown SEP",
            "doctor_name": rm.doctor.name if rm.doctor else "Unknown Doctor",
            "diagnosis_name": get_diagnosis_name(rm.diagnosa_utama)
        }
        rm_responses.append(rm_data)
    
    return rm_responses

@router.get("/rekam-medis/{rm_id}", response_model=RekamMedisResponse)
def read_medical_record(
    rm_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    medical_record = get_medical_record(db, rm_id)
    if not medical_record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    # Authorization check
    if current_user.role.name in ["uploader", "faskes"] and medical_record.sep.facility_id != current_user.facility_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Manual mapping untuk single RekamMedis
    rm_data = {
        "id": medical_record.id,
        "patient_id": medical_record.patient_id,
        "sep_id": medical_record.sep_id,
        "dokter_id": medical_record.dokter_id,
        "tanggal_masuk": medical_record.tanggal_masuk,
        "tanggal_keluar": medical_record.tanggal_keluar,
        "diagnosa_masuk": medical_record.diagnosa_masuk,
        "diagnosa_utama": medical_record.diagnosa_utama,
        "diagnosa_sekunder": medical_record.diagnosa_sekunder,
        "tindakan": medical_record.tindakan,
        "komplikasi": medical_record.komplikasi,
        "alergi": medical_record.alergi,
        "icd_x": medical_record.icd_x,
        "berkas_path": medical_record.berkas_path,
        "created_at": medical_record.created_at,
        "updated_at": medical_record.updated_at,
        "patient_name": medical_record.patient.name if medical_record.patient else "Unknown Patient",
        "sep_number": medical_record.sep.sep_number if medical_record.sep else "Unknown SEP",
        "doctor_name": medical_record.doctor.name if medical_record.doctor else "Unknown Doctor",
        "diagnosis_name": get_diagnosis_name(medical_record.diagnosa_utama)
    }
    
    return rm_data

@router.post("/rekam-medis/", response_model=RekamMedisResponse)
def create_new_medical_record(
    rm: RekamMedisCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if SEP belongs to user's facility
    if current_user.role.name in ["uploader", "faskes"]:
        sep = get_sep(db, rm.sep_id)
        if not sep or sep.facility_id != current_user.facility_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_medical_record(db=db, rm=rm)