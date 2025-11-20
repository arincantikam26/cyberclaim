from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
import uuid
from models.doctor import Doctor
from schemas.doctor import DoctorCreate, DoctorUpdate

def get_doctor(db: Session, doctor_id: uuid.UUID):
    # ✅ PASTIKAN menggunakan joinedload dengan benar
    return db.query(Doctor).options(joinedload(Doctor.facility)).filter(Doctor.id == doctor_id).first()

def get_doctors(db: Session, skip: int = 0, limit: int = 100, search: str = None, facility_id: uuid.UUID = None):
    # ✅ PASTIKAN menggunakan joinedload dengan benar
    query = db.query(Doctor).options(joinedload(Doctor.facility))
    
    if search:
        query = query.filter(
            or_(
                Doctor.name.ilike(f"%{search}%"),
                Doctor.specialization.ilike(f"%{search}%"),
                Doctor.bpjs_id.ilike(f"%{search}%")
            )
        )
    if facility_id:
        query = query.filter(Doctor.facility_id == facility_id)
    
    return query.offset(skip).limit(limit).all()

def create_doctor(db: Session, doctor: DoctorCreate):
    db_doctor = Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

def update_doctor(db: Session, doctor_id: uuid.UUID, doctor_update: DoctorUpdate):
    # ✅ Juga gunakan joinedload untuk update
    db_doctor = db.query(Doctor).options(joinedload(Doctor.facility)).filter(Doctor.id == doctor_id).first()
    if not db_doctor:
        return None
    
    update_data = doctor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_doctor, field, value)
    
    db.commit()
    db.refresh(db_doctor)
    return db_doctor