from sqlalchemy.orm import Session
import uuid
from app.models.facility import Facility, JenisSarana
from app.schemas.facility import FacilityCreate, FacilityUpdate

def get_facility(db: Session, facility_id: uuid.UUID):
    return db.query(Facility).filter(Facility.id == facility_id).first()

def get_facilities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Facility).offset(skip).limit(limit).all()

def create_facility(db: Session, facility: FacilityCreate):
    db_facility = Facility(**facility.dict())
    db.add(db_facility)
    db.commit()
    db.refresh(db_facility)
    return db_facility

def update_facility(db: Session, facility_id: uuid.UUID, facility_update: FacilityUpdate):
    db_facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not db_facility:
        return None
    
    update_data = facility_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_facility, field, value)
    
    db.commit()
    db.refresh(db_facility)
    return db_facility

def get_jenis_sarana(db: Session):
    return db.query(JenisSarana).all()

def get_jenis_sarana_by_id(db: Session, jenis_id: int):
    return db.query(JenisSarana).filter(JenisSarana.id == jenis_id).first()