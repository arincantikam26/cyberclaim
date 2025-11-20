from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
import uuid
from models.medical import SEP, RekamMedis, Diagnosis, Tindakan, TarifINACBGS
from schemas.medical import SEPCreate, RekamMedisCreate, DiagnosisBase, TindakanBase, TarifINACBGSBase

def get_sep(db: Session, sep_id: uuid.UUID):
    # ✅ Tambahkan eager loading
    return db.query(SEP).options(
        joinedload(SEP.patient),
        joinedload(SEP.facility),
        joinedload(SEP.doctor)
    ).filter(SEP.id == sep_id).first()

def get_seps(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    # ✅ Tambahkan eager loading
    query = db.query(SEP).options(
        joinedload(SEP.patient),
        joinedload(SEP.facility),
        joinedload(SEP.doctor)
    )
    if search:
        query = query.filter(
            or_(
                SEP.sep_number.ilike(f"%{search}%"),
                SEP.poli.ilike(f"%{search}%")
            )
        )
    return query.offset(skip).limit(limit).all()

def create_sep(db: Session, sep: SEPCreate):
    db_sep = SEP(**sep.dict())
    db.add(db_sep)
    db.commit()
    db.refresh(db_sep)
    return db_sep

def update_sep(db: Session, sep_id: uuid.UUID, sep_update):
    db_sep = db.query(SEP).filter(SEP.id == sep_id).first()
    if not db_sep:
        return None
    
    update_data = sep_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sep, field, value)
    
    db.commit()
    db.refresh(db_sep)
    return db_sep

def get_medical_record(db: Session, rm_id: uuid.UUID):
    # ✅ Tambahkan eager loading
    return db.query(RekamMedis).options(
        joinedload(RekamMedis.patient),
        joinedload(RekamMedis.sep),
        joinedload(RekamMedis.doctor)
    ).filter(RekamMedis.id == rm_id).first()

def get_medical_records(db: Session, skip: int = 0, limit: int = 100):
    # ✅ Tambahkan eager loading
    return db.query(RekamMedis).options(
        joinedload(RekamMedis.patient),
        joinedload(RekamMedis.sep),
        joinedload(RekamMedis.doctor)
    ).offset(skip).limit(limit).all()

def create_medical_record(db: Session, rm: RekamMedisCreate):
    db_rm = RekamMedis(**rm.dict())
    db.add(db_rm)
    db.commit()
    db.refresh(db_rm)
    return db_rm

def update_medical_record(db: Session, rm_id: uuid.UUID, rm_update):
    db_rm = db.query(RekamMedis).filter(RekamMedis.id == rm_id).first()
    if not db_rm:
        return None
    
    update_data = rm_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_rm, field, value)
    
    db.commit()
    db.refresh(db_rm)
    return db_rm

# ... fungsi diagnosis, tindakan, tarif tetap sama
def get_diagnosis(db: Session, diagnosis_code: str):
    return db.query(Diagnosis).filter(Diagnosis.code == diagnosis_code).first()

def get_diagnoses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Diagnosis).offset(skip).limit(limit).all()

def create_diagnosis(db: Session, diagnosis: DiagnosisBase):
    db_diagnosis = Diagnosis(**diagnosis.dict())
    db.add(db_diagnosis)
    db.commit()
    db.refresh(db_diagnosis)
    return db_diagnosis

def get_tindakan(db: Session, tindakan_code: str):
    return db.query(Tindakan).filter(Tindakan.code == tindakan_code).first()

def get_tindakans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tindakan).offset(skip).limit(limit).all()

def create_tindakan(db: Session, tindakan: TindakanBase):
    db_tindakan = Tindakan(**tindakan.dict())
    db.add(db_tindakan)
    db.commit()
    db.refresh(db_tindakan)
    return db_tindakan

def get_tarif_inacbgs(db: Session, tarif_id: uuid.UUID):
    return db.query(TarifINACBGS).filter(TarifINACBGS.id == tarif_id).first()

def get_tarif_inacbgs_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(TarifINACBGS).offset(skip).limit(limit).all()

def create_tarif_inacbgs(db: Session, tarif: TarifINACBGSBase):
    db_tarif = TarifINACBGS(**tarif.dict())
    db.add(db_tarif)
    db.commit()
    db.refresh(db_tarif)
    return db_tarif

def update_tarif_inacbgs(db: Session, tarif_id: uuid.UUID, tarif_update):
    db_tarif = db.query(TarifINACBGS).filter(TarifINACBGS.id == tarif_id).first()
    if not db_tarif:
        return None
    
    update_data = tarif_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tarif, field, value)
    
    db.commit()
    db.refresh(db_tarif)
    return db_tarif