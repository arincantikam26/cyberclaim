from sqlalchemy.orm import Session
from sqlalchemy import or_
import uuid
from models.patient import Patient
from schemas.patient import PatientCreate, PatientUpdate

def get_patient(db: Session, patient_id: uuid.UUID):
    return db.query(Patient).filter(Patient.id == patient_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(Patient)
    if search:
        query = query.filter(
            or_(
                Patient.name.ilike(f"%{search}%"),
                Patient.nik.ilike(f"%{search}%"),
                Patient.bpjs_number.ilike(f"%{search}%")
            )
        )
    return query.offset(skip).limit(limit).all()

def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: uuid.UUID, patient_update: PatientUpdate):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        return None
    
    update_data = patient_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_patient, field, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient