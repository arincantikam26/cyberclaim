from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from app.database import get_db, create_tables
from app.routes import (
    auth, dashboard, upload, facility, patient, 
    doctor, user, inacbgs, medical, claim, fraud
)

# Create tables
create_tables()

app = FastAPI(
    title="CyberClaim API",
    description="Sistem Manajemen Klaim BPJS dengan Fraud Detection",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("app/uploads/claims", exist_ok=True)
os.makedirs("app/uploads/documents", exist_ok=True)
os.makedirs("app/uploads/temp", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

# Include routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(facility.router, prefix="/api/facilities", tags=["Facilities"])
app.include_router(patient.router, prefix="/api/patients", tags=["Patients"])
app.include_router(doctor.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(inacbgs.router, prefix="/api/inacbgs", tags=["INACBGS"])
app.include_router(medical.router, prefix="/api/medical", tags=["Medical Records"])
app.include_router(claim.router, prefix="/api/claims", tags=["Claims"])
app.include_router(fraud.router, prefix="/api/fraud", tags=["Fraud Detection"])

@app.get("/")
def read_root():
    return {"message": "CyberClaim API", "version": "1.0.0"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)