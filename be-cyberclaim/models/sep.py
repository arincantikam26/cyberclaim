from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.db.base import Base

class SEP(Base):
    __tablename__ = "sep"

    id = Column(Integer, primary_key=True, index=True)
    sep_number = Column(String, unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    diagnosa_awal = Column(String)
    sep_date = Column(Date)
