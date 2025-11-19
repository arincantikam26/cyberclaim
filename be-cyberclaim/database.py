from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:asp1209@localhost:5432/cyberfraud")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    from app.models.user import User, Role
    from app.models.facility import Facility, JenisSarana
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.medical import SEP, RekamMedis, Diagnosis, Tindakan, TarifINACBGS
    from app.models.claim import ClaimSubmission, ClaimFiles
    from app.models.fraud import FraudDetection
    Base.metadata.create_all(bind=engine)