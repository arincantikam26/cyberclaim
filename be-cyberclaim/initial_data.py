import uuid
from datetime import datetime, date
from sqlalchemy.orm import Session
from database import SessionLocal
from utils.security  import get_password_hash
import json

# Import semua model yang diperlukan
from models import (
    Role, User, Facility, JenisSarana, Doctor, Patient, 
    Diagnosis, Tindakan, TarifINACBGS, ClaimSubmission, FraudDetection, ClaimFiles, SEP, RekamMedis
)

def init_roles(db: Session):
    """Initialize role data"""
    roles = [
        {"name": "superadmin", "description": "Super Administrator dengan akses penuh"},
        {"name": "admin", "description": "Administrator dengan akses terbatas"},
        {"name": "uploader", "description": "Uploader/Faskes untuk upload claim"},
        {"name": "validator", "description": "Validator untuk memvalidasi claim"}
    ]
    
    for role_data in roles:
        existing_role = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not existing_role:
            role = Role(
                id=uuid.uuid4(),
                name=role_data["name"],
                description=role_data["description"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(role)
            print(f"✓ Role {role_data['name']} created")
        else:
            print(f"✓ Role {role_data['name']} already exists")
    
    db.commit()
    print("✓ All roles initialized")
    return db.query(Role).all()

def init_jenis_sarana(db: Session):
    """Initialize jenis sarana data"""
    jenis_sarana_data = [
        {"id": 101, "code": "PRK", "name": "Praktek Dokter Mandiri", "description": "Praktek dokter umum atau spesialis mandiri"},
        {"id": 102, "code": "PUS", "name": "Puskesmas", "description": "Pusat Kesehatan Masyarakat"},
        {"id": 103, "code": "KLN", "name": "Klinik", "description": "Klinik pratama atau utama"},
        {"id": 104, "code": "RS", "name": "Rumah Sakit", "description": "Rumah Sakit Umum/Khusus"}
    ]
    
    for data in jenis_sarana_data:
        existing = db.query(JenisSarana).filter(JenisSarana.id == data["id"]).first()
        if not existing:
            jenis_sarana = JenisSarana(
                id=data["id"],
                code=data["code"],
                name=data["name"],
                description=data["description"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(jenis_sarana)
            print(f"✓ Jenis Sarana {data['name']} created")
        else:
            print(f"✓ Jenis Sarana {data['name']} already exists")
    
    db.commit()
    return db.query(JenisSarana).all()

def init_facilities(db: Session):
    """Initialize 20 facility data"""
    facilities_data = [
        {
            "code": "RSUD001",
            "name": "RSUD Budi Mulia",
            "telp": "(021) 1234567",
            "website": "https://rsudbudimulia.jakarta.go.id",
            "address": "Jl. Kesehatan Raya No. 123",
            "province": "DKI Jakarta",
            "city": "Jakarta Pusat",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSIA042",
            "name": "RSIA Bunda Sejahtera",
            "telp": "(0411) 8889999",
            "website": "www.bundasejahtera.co.id",
            "address": "Jl. A.P. Pettarani Kav. 5",
            "province": "Sulawesi Selatan",
            "city": "Makassar",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSJ021",
            "name": "RSJ Dr. Soeradji Tironoloyo",
            "telp": "(0274) 4477000",
            "website": "www.rsjsoeradji.com",
            "address": "Jl. Kaliurang KM. 17,5",
            "province": "Daerah Istimewa Yogyakarta",
            "city": "Sleman",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSU101",
            "name": "RSU Sumber Waras",
            "telp": "(031) 5678123",
            "website": "www.sumberwarashospital.com",
            "address": "Jl. Diponegoro No. 81",
            "province": "Jawa Timur",
            "city": "Surabaya",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RST055",
            "name": "Rumah Sakit TNI AU Balikpapan",
            "telp": "(0542) 876555",
            "website": "",
            "address": "Jl. Marsekal Suryadarma No. 1",
            "province": "Kalimantan Timur",
            "city": "Balikpapan",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSUD002",
            "name": "RSUD Cibabat",
            "telp": "(022) 6654321",
            "website": "https://rsudcibabat.cimahikota.go.id",
            "address": "Jl. Cibabat No. 221",
            "province": "Jawa Barat",
            "city": "Cimahi",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSK078",
            "name": "RS Khusus Ginjal Nusantara",
            "telp": "(061) 8881000",
            "website": "www.nusantarakidneyhospital.com",
            "address": "Jl. Gatot Subroto No. 15",
            "province": "Sumatera Utara",
            "city": "Medan",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSU033",
            "name": "RS Universitas Andalas",
            "telp": "(0751) 123456",
            "website": "www.rsunand.ac.id",
            "address": "Jl. Perintis Kemerdekaan No. 94",
            "province": "Sumatera Barat",
            "city": "Padang",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSO012",
            "name": "RS Orthopedi dan Traumatologi Nusa Dua",
            "telp": "(0361) 1234567",
            "website": "www.orthonusadua.com",
            "address": "Jl. By Pass Ngurah Rai No. 100",
            "province": "Bali",
            "city": "Badung",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "RSU087",
            "name": "RSUD Abdoel Moeleok",
            "telp": "(0721) 1234567",
            "website": "https://rsam.lampungprov.go.id",
            "address": "Jl. Dr. Rivai No. 6",
            "province": "Lampung",
            "city": "Bandar Lampung",
            "jenis_sarana_id": 104,
            "operasional": True
        },
        {
            "code": "KLN001",
            "name": "Klinik Sehat Terpadu",
            "telp": "(021) 5551001",
            "website": "www.kliniksehatterpadu.co.id",
            "address": "Jl. Melati Raya No. 15",
            "province": "DKI Jakarta",
            "city": "Jakarta Selatan",
            "jenis_sarana_id": 103,
            "operasional": True
        },
        {
            "code": "KLN042",
            "name": "Klinik Bunda Sejahtera",
            "telp": "(0411) 8889999",
            "website": "www.bundasejahtera.co.id",
            "address": "Jl. A.P. Pettarani Kav. 5",
            "province": "Sulawesi Selatan",
            "city": "Makassar",
            "jenis_sarana_id": 103,
            "operasional": True
        },
        {
            "code": "KLN033",
            "name": "Klinik Utama Andalas",
            "telp": "(0751) 123456",
            "website": "www.klinikandalas.co.id",
            "address": "Jl. Perintis Kemerdekaan No. 94",
            "province": "Sumatera Barat",
            "city": "Padang",
            "jenis_sarana_id": 103,
            "operasional": True
        },
        {
            "code": "PUS021",
            "name": "Puskesmas Sleman Utara",
            "telp": "(0274) 4477000",
            "website": "",
            "address": "Jl. Kaliurang KM. 17,5",
            "province": "Daerah Istimewa Yogyakarta",
            "city": "Sleman",
            "jenis_sarana_id": 102,
            "operasional": True
        },
        {
            "code": "PUS002",
            "name": "Puskesmas Cibabat",
            "telp": "(022) 6654321",
            "website": "",
            "address": "Jl. Cibabat No. 221",
            "province": "Jawa Barat",
            "city": "Cimahi",
            "jenis_sarana_id": 102,
            "operasional": True
        },
        {
            "code": "PUS045",
            "name": "Puskesmas Tamalanrea",
            "telp": "(0411) 5678901",
            "website": "",
            "address": "Jl. Perintis Kemerdekaan KM. 10",
            "province": "Sulawesi Selatan",
            "city": "Makassar",
            "jenis_sarana_id": 102,
            "operasional": True
        },
        {
            "code": "PRK101",
            "name": "Praktek Dokter Mandiri Sumber Waras",
            "telp": "(031) 5678123",
            "website": "",
            "address": "Jl. Diponegoro No. 81",
            "province": "Jawa Timur",
            "city": "Surabaya",
            "jenis_sarana_id": 101,
            "operasional": True
        },
        {
            "code": "PRK012",
            "name": "Praktek Dokter Spesialis Orthopedi",
            "telp": "(0361) 1234567",
            "website": "",
            "address": "Jl. By Pass Ngurah Rai No. 100",
            "province": "Bali",
            "city": "Badung",
            "jenis_sarana_id": 101,
            "operasional": True
        },
        {
            "code": "PRK067",
            "name": "Praktek Dokter Umum Sehati",
            "telp": "(021) 9876543",
            "website": "",
            "address": "Jl. Sudirman No. 45",
            "province": "DKI Jakarta",
            "city": "Jakarta Selatan",
            "jenis_sarana_id": 101,
            "operasional": True
        },
        {
            "code": "PRK089",
            "name": "Praktek Bidan Sari Husada",
            "telp": "(0274) 3344556",
            "website": "",
            "address": "Jl. Magelang No. 78",
            "province": "Daerah Istimewa Yogyakarta",
            "city": "Yogyakarta",
            "jenis_sarana_id": 101,
            "operasional": True
        }
    ]
    
    facility_objects = []
    for facility_data in facilities_data:
        existing_facility = db.query(Facility).filter(Facility.code == facility_data["code"]).first()
        if not existing_facility:
            facility = Facility(
                id=uuid.uuid4(),
                code=facility_data["code"],
                name=facility_data["name"],
                telp=facility_data["telp"],
                website=facility_data["website"],
                address=facility_data["address"],
                province=facility_data["province"],
                city=facility_data["city"],
                jenis_sarana_id=facility_data["jenis_sarana_id"],
                operasional=facility_data["operasional"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(facility)
            facility_objects.append(facility)
            print(f"✓ Facility {facility_data['name']} ({facility_data['code']}) created")
        else:
            facility_objects.append(existing_facility)
            print(f"✓ Facility {facility_data['name']} ({facility_data['code']}) already exists")
    
    db.commit()
    print(f"✓ {len(facility_objects)} facilities initialized")
    return facility_objects

def init_doctors(db: Session, facilities: list):
    """Initialize 40 doctor data"""
    specializations = [
        "Penyakit Dalam", "Bedah", "Anak", "Kandungan", "Jantung",
        "Saraf", "Kulit dan Kelamin", "THT", "Mata", "Psikiatri",
        "Orthopedi", "Radiologi", "Anestesi", "Patologi", "Umum"
    ]
    
    doctor_objects = []
    for i in range(40):
        bpjs_id = f"DR{i+1:06d}"
        
        # PERBAIKAN: Cek existing doctor berdasarkan bpjs_id, bukan id
        existing_doctor = db.query(Doctor).filter(Doctor.bpjs_id == bpjs_id).first()
        if not existing_doctor:
            first_names = ["Dr. Budi", "Dr. Sari", "Dr. Ahmad", "Dr. Dewi", "Dr. Hendra", "Dr. Lisa", "Dr. Rudi", "Dr. Maya"]
            last_names = ["Santoso", "Wijaya", "Putra", "Kusuma", "Pratama", "Siregar", "Hadi", "Lestari"]
            
            doctor = Doctor(
                id=uuid.uuid4(),
                name=f"{first_names[i % len(first_names)]} {last_names[i % len(last_names)]}",
                specialization=specializations[i % len(specializations)],
                bpjs_id=bpjs_id,
                birth_date=date(1970 + (i % 30), (i % 12) + 1, (i % 28) + 1),
                gender=["L", "P"][i % 2],
                telp=f"08{100000000 + i}",
                address=f"Jl. Dokter No. {i+1}",
                facility_id=facilities[i % len(facilities)].id,
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(doctor)
            doctor_objects.append(doctor)
            print(f"✓ Doctor {doctor.name} ({bpjs_id}) created")
        else:
            doctor_objects.append(existing_doctor)
            print(f"✓ Doctor {existing_doctor.name} ({bpjs_id}) already exists")
    
    db.commit()
    print(f"✓ {len(doctor_objects)} doctors initialized")
    return doctor_objects

def init_patients(db: Session):
    """Initialize 10 patient data"""
    
    patient_objects = []
    for i in range(10):
        nik = f"12345678901234{i:02d}"
        bpjs_number = f"00012345678{i:02d}"
        
        # PERBAIKAN: Cek existing patient berdasarkan NIK
        existing_patient = db.query(Patient).filter(Patient.nik == nik).first()
        if not existing_patient:
            first_names = ["Budi", "Sari", "Ahmad", "Dewi", "Hendra", "Lisa", "Rudi", "Maya", "Joko", "Siti"]
            last_names = ["Santoso", "Wijaya", "Putra", "Kusuma", "Pratama", "Siregar", "Hadi", "Lestari", "Wibowo", "Nur"]
            
            patient = Patient(
                id=uuid.uuid4(),
                name=f"{first_names[i]} {last_names[i]}",
                birth_date=date(1980 + (i % 30), (i % 12) + 1, (i % 28) + 1),
                gender=["L", "P"][i % 2],
                telp=f"08{200000000 + i}",
                address=f"Jl. Pasien No. {i+1}",
                nik=nik,
                bpjs_number=bpjs_number,
                membership_json={
                    "plan_type": "PBI" if i % 3 == 0 else "Non PBI",
                    "active": True,
                    "start_date": "2023-01-01",
                    "expiry_date": "2024-12-31"
                },
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(patient)
            patient_objects.append(patient)
            print(f"✓ Patient {patient.name} (NIK: {nik}) created")
        else:
            patient_objects.append(existing_patient)
            print(f"✓ Patient {existing_patient.name} (NIK: {nik}) already exists")
    
    db.commit()
    print(f"✓ {len(patient_objects)} patients initialized")
    return patient_objects

def init_medical_data(db: Session):
    """Initialize medical data (diagnosis, tindakan, tarif)"""
    # Diagnosis data
    diagnoses = [
        {"code": "A00", "description": "Kolera"},
        {"code": "I10", "description": "Hipertensi Esensial"},
        {"code": "E11", "description": "Diabetes Mellitus Tipe 2"},
        {"code": "J18", "description": "Pneumonia"},
        {"code": "K29", "description": "Gastritis dan Duodenitis"}
    ]
    
    for diag in diagnoses:
        existing = db.query(Diagnosis).filter(Diagnosis.code == diag["code"]).first()
        if not existing:
            diagnosis = Diagnosis(
                id=uuid.uuid4(),
                code=diag["code"],
                description=diag["description"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(diagnosis)
    
    # Tindakan data
    tindakan_list = [
        {"code": "T001", "description": "Konsultasi Dokter Umum"},
        {"code": "T002", "description": "Konsultasi Dokter Spesialis"},
        {"code": "T003", "description": "Pemeriksaan Laboratorium Darah"},
        {"code": "T004", "description": "Rontgen Thorax"},
        {"code": "T005", "description": "USG Abdomen"}
    ]
    
    for tindakan in tindakan_list:
        existing = db.query(Tindakan).filter(Tindakan.code == tindakan["code"]).first()
        if not existing:
            tindakan_obj = Tindakan(
                id=uuid.uuid4(),
                code=tindakan["code"],
                description=tindakan["description"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(tindakan_obj)
    
    # Tarif INACBGS
    tarif_data = [
        {"diagnosa_code": "I10", "description": "Hipertensi", "tarif_inacbgs": 1500000},
        {"diagnosa_code": "E11", "description": "Diabetes", "tarif_inacbgs": 2000000},
        {"diagnosa_code": "J18", "description": "Pneumonia", "tarif_inacbgs": 3000000},
    ]
    
    for tarif in tarif_data:
        existing = db.query(TarifINACBGS).filter(TarifINACBGS.diagnosa_code == tarif["diagnosa_code"]).first()
        if not existing:
            tarif_obj = TarifINACBGS(
                id=uuid.uuid4(),
                diagnosa_code=tarif["diagnosa_code"],
                description=tarif["description"],
                tarif_inacbgs=tarif["tarif_inacbgs"],
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(tarif_obj)
    
    db.commit()
    print("✓ Medical data initialized")

def init_users(db: Session, roles: list, facilities: list):
    """Initialize 20 user data"""
    users_data = [
        # Superadmin
        {
            "username": "superadmin",
            "email": "superadmin@bpjs.go.id",
            "password": "superadmin123",
            "full_name": "Super Administrator",
            "role_name": "superadmin",
            "facility_code": None
        },
        # Admins
        {
            "username": "admin_rsud001",
            "email": "admin@rsudbudimulia.go.id",
            "password": "admin123",
            "full_name": "Admin RSUD Budi Mulia",
            "role_name": "admin",
            "facility_code": "RSUD001"
        },
        {
            "username": "admin_rsia042",
            "email": "admin@bundasejahtera.co.id",
            "password": "admin123",
            "full_name": "Admin RSIA Bunda Sejahtera",
            "role_name": "admin",
            "facility_code": "RSIA042"
        },
        # Uploaders
        {
            "username": "uploader_rsud001",
            "email": "uploader@rsudbudimulia.go.id",
            "password": "uploader123",
            "full_name": "Uploader RSUD Budi Mulia",
            "role_name": "uploader",
            "facility_code": "RSUD001"
        },
        {
            "username": "uploader_rsia042",
            "email": "uploader@bundasejahtera.co.id",
            "password": "uploader123",
            "full_name": "Uploader RSIA Bunda Sejahtera",
            "role_name": "uploader",
            "facility_code": "RSIA042"
        },
        {
            "username": "uploader_rsj021",
            "email": "uploader@rsjsoeradji.com",
            "password": "uploader123",
            "full_name": "Uploader RSJ Soeradji",
            "role_name": "uploader",
            "facility_code": "RSJ021"
        },
        # Validators
        {
            "username": "validator1",
            "email": "validator1@bpjs.go.id",
            "password": "validator123",
            "full_name": "Validator BPJS 1",
            "role_name": "validator",
            "facility_code": None
        },
        {
            "username": "validator2",
            "email": "validator2@bpjs.go.id",
            "password": "validator123",
            "full_name": "Validator BPJS 2",
            "role_name": "validator",
            "facility_code": None
        },
        # Additional users untuk mencapai 20 data
        {
            "username": "admin_kln001",
            "email": "admin@kliniksehatterpadu.co.id",
            "password": "admin123",
            "full_name": "Admin Klinik Sehat Terpadu",
            "role_name": "admin",
            "facility_code": "KLN001"
        },
        {
            "username": "uploader_kln001",
            "email": "uploader@kliniksehatterpadu.co.id",
            "password": "uploader123",
            "full_name": "Uploader Klinik Sehat Terpadu",
            "role_name": "uploader",
            "facility_code": "KLN001"
        },
        {
            "username": "admin_pus021",
            "email": "admin@puskesmassleman.go.id",
            "password": "admin123",
            "full_name": "Admin Puskesmas Sleman",
            "role_name": "admin",
            "facility_code": "PUS021"
        },
        {
            "username": "uploader_pus021",
            "email": "uploader@puskesmassleman.go.id",
            "password": "uploader123",
            "full_name": "Uploader Puskesmas Sleman",
            "role_name": "uploader",
            "facility_code": "PUS021"
        },
        {
            "username": "admin_rst055",
            "email": "admin@rstni-balikpapan.mil.id",
            "password": "admin123",
            "full_name": "Admin RS TNI Balikpapan",
            "role_name": "admin",
            "facility_code": "RST055"
        },
        {
            "username": "uploader_rst055",
            "email": "uploader@rstni-balikpapan.mil.id",
            "password": "uploader123",
            "full_name": "Uploader RS TNI Balikpapan",
            "role_name": "uploader",
            "facility_code": "RST055"
        },
        {
            "username": "admin_rso012",
            "email": "admin@orthonusadua.com",
            "password": "admin123",
            "full_name": "Admin RS Orthopedi Nusa Dua",
            "role_name": "admin",
            "facility_code": "RSO012"
        },
        {
            "username": "uploader_rso012",
            "email": "uploader@orthonusadua.com",
            "password": "uploader123",
            "full_name": "Uploader RS Orthopedi Nusa Dua",
            "role_name": "uploader",
            "facility_code": "RSO012"
        },
        {
            "username": "admin_rsu087",
            "email": "admin@rsam.lampungprov.go.id",
            "password": "admin123",
            "full_name": "Admin RSUD Abdoel Moeleok",
            "role_name": "admin",
            "facility_code": "RSU087"
        },
        {
            "username": "uploader_rsu087",
            "email": "uploader@rsam.lampungprov.go.id",
            "password": "uploader123",
            "full_name": "Uploader RSUD Abdoel Moeleok",
            "role_name": "uploader",
            "facility_code": "RSU087"
        },
        {
            "username": "validator3",
            "email": "validator3@bpjs.go.id",
            "password": "validator123",
            "full_name": "Validator BPJS 3",
            "role_name": "validator",
            "facility_code": None
        },
        {
            "username": "validator4",
            "email": "validator4@bpjs.go.id",
            "password": "validator123",
            "full_name": "Validator BPJS 4",
            "role_name": "validator",
            "facility_code": None
        }
    ]
    
    user_objects = []
    for user_data in users_data:
        existing_user = db.query(User).filter(User.username == user_data["username"]).first()
        if not existing_user:
            # Find role
            role = next((r for r in roles if r.name == user_data["role_name"]), None)
            if not role:
                print(f"✗ Role {user_data['role_name']} not found for user {user_data['username']}")
                continue
            
            # Find facility if specified
            facility = None
            if user_data["facility_code"]:
                facility = next((f for f in facilities if f.code == user_data["facility_code"]), None)
                if not facility:
                    print(f"✗ Facility {user_data['facility_code']} not found for user {user_data['username']}")
                    continue
            
            user = User(
                id=uuid.uuid4(),
                username=user_data["username"],
                email=user_data["email"],
                # PERBAIKAN: ganti password_hash menjadi password
                password=get_password_hash(user_data["password"]),  # ✅ Ini yang diperbaiki
                full_name=user_data["full_name"],
                role_id=role.id,
                facility_id=facility.id if facility else None,
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(user)
            user_objects.append(user)
            print(f"✓ User {user_data['username']} created")
        else:
            user_objects.append(existing_user)
            print(f"✓ User {user_data['username']} already exists")
    
    db.commit()
    print(f"✓ {len(user_objects)} users initialized")
    return user_objects

def init_claims_and_fraud(db: Session, users: list, patients: list, facilities: list):
    """Initialize complete claims and fraud detection system with all dependencies"""
    
    print("🚀 Initializing claims and fraud detection system...")
    
    # 1. First, check and initialize SEP data if needed
    print("📋 Step 1: Checking SEP data...")
    from models import SEP
    existing_sep = db.query(SEP).count()
    if existing_sep == 0:
        print("   ⚠️  No SEP data found. Creating sample SEP records...")
        # Create sample SEP data
        doctors = db.query(Doctor).limit(4).all()
        if not doctors:
            print("   ❌ No doctors available for SEP creation")
            return
        
        sep_objects = []
        for i, patient in enumerate(patients[:4]):  # Use first 4 patients
            sep_obj = SEP(
                id=uuid.uuid4(),
                sep_number=f"SEP-2024-{i+1:05d}",
                patient_id=patient.id,
                facility_id=doctors[i % len(doctors)].facility_id,
                doctor_id=doctors[i % len(doctors)].id,
                diagnosa_awal="I10",  # Hipertensi
                diagnosa_utama="I10",
                poli="Penyakit Dalam",
                kelas_rawat="Kelas 1",
                penjamin="BPJS",
                sep_date=date(2024, 1, 10 + i),
                rujukan_facility=None,
                qr_code_hash=f"qr_sep_{i+1}",
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(sep_obj)
            sep_objects.append(sep_obj)
            print(f"   ✅ SEP {sep_obj.sep_number} created for {patient.name}")
        
        db.commit()
        print("   ✅ 4 SEP records created")
    else:
        sep_objects = db.query(SEP).limit(4).all()
        print(f"   ✅ {existing_sep} SEP records already exist")

    # 2. Check and initialize RekamMedis data if needed
    print("📋 Step 2: Checking RekamMedis data...")
    from models import RekamMedis
    existing_rm = db.query(RekamMedis).count()
    if existing_rm == 0:
        print("   ⚠️  No RekamMedis data found. Creating sample records...")
        rm_objects = []
        for i, (patient, sep_obj) in enumerate(zip(patients[:4], sep_objects)):
            rm_obj = RekamMedis(
                id=uuid.uuid4(),
                patient_id=patient.id,
                sep_id=sep_obj.id,
                dokter_id=sep_obj.doctor_id,
                tanggal_masuk=datetime(2024, 1, 10 + i, 8, 0, 0),
                tanggal_keluar=datetime(2024, 1, 12 + i, 14, 0, 0),
                diagnosa_masuk="Hipertensi grade 2",
                diagnosa_utama="I10",
                diagnosa_sekunder=["E11", "K29"],  # Diabetes, Gastritis
                tindakan=["T001", "T003"],  # Konsultasi, Lab
                komplikasi="Tidak ada",
                alergi="Tidak ada",
                icd_x="I10",
                berkas_path=f"/uploads/rm/rm_{i+1}.pdf",
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(rm_obj)
            rm_objects.append(rm_obj)
            print(f"   ✅ RekamMedis created for {patient.name}")
        
        db.commit()
        print("   ✅ 4 RekamMedis records created")
    else:
        rm_objects = db.query(RekamMedis).limit(4).all()
        print(f"   ✅ {existing_rm} RekamMedis records already exist")

    # 3. Check existing claims
    print("📋 Step 3: Checking existing claims...")
    existing_claims = db.query(ClaimSubmission).count()
    if existing_claims > 0:
        print(f"   ✅ {existing_claims} claims already exist")
        
        # Check and create fraud detections if needed
        existing_fraud = db.query(FraudDetection).count()
        if existing_fraud == 0:
            print("   ⚠️  Creating fraud detections for existing claims...")
            claims = db.query(ClaimSubmission).limit(4).all()
            for i, claim_obj in enumerate(claims):
                fraud = FraudDetection(
                    id=uuid.uuid4(),
                    claim_id=claim_obj.id,
                    detection_type=["DUPLICATE_CLAIM", "OVERUTILIZATION", "UPCODING", "FRAUDULENT_BILLING"][i % 4],
                    risk_level=["HIGH", "MEDIUM", "LOW", "HIGH"][i % 4],
                    confidence=[0.85, 0.65, 0.45, 0.90][i % 4],
                    description=f"Automated fraud detection pattern {i+1}",
                    details={
                        "rule_triggered": f"RULE_{i+1}",
                        "analysis_date": datetime.now().isoformat(),
                        "suggested_action": "REVIEW",
                        "confidence_score": [0.85, 0.65, 0.45, 0.90][i % 4]
                    },
                    is_resolved=False,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                db.add(fraud)
                print(f"   ✅ Fraud detection {i+1} created")
            
            db.commit()
            print("   ✅ 4 fraud detections created")
        else:
            print(f"   ✅ {existing_fraud} fraud detections already exist")
        
        return

    # 4. Create new claims
    print("📋 Step 4: Creating new claims...")
    uploaders = [u for u in users if hasattr(u.role, 'name') and u.role.name == "uploader"]
    
    if not uploaders:
        print("   ❌ No uploader users found")
        return

    if len(sep_objects) < 4 or len(rm_objects) < 4:
        print("   ❌ Insufficient SEP or RekamMedis data")
        return

    claim_objects = []
    claim_statuses = ["UPLOADED", "VALIDATED", "FRAUD_CHECK", "APPROVED"]  # Use uppercase
    
    for i in range(4):
        try:
            claim_obj = ClaimSubmission(
                id=uuid.uuid4(),
                facility_id=uploaders[i % len(uploaders)].facility_id,
                user_id=uploaders[i % len(uploaders)].id,
                patient_id=patients[i].id,
                sep_id=sep_objects[i].id,  # Use actual SEP ID
                rm_id=rm_objects[i].id,    # Use actual RekamMedis ID
                rar_file_path=f"/uploads/claims/claim_{i+1}_2024.rar",
                upload_at=datetime.now(),
                status=claim_statuses[i],  # Use uppercase enum values
                notes=f"Claim submission for {patients[i].name} - {['Hipertensi', 'Diabetes', 'Pneumonia', 'Gastritis'][i]}",
                validated_by=users[0].id if i > 0 else None,  # First claim not validated
                validated_at=datetime.now() if i > 0 else None,
                validation_data={
                    "sep_valid": True,
                    "rm_complete": True,
                    "diagnosis_match": True,
                    "total_amount": [2500000, 3500000, 4500000, 2800000][i]
                }
            )
            db.add(claim_obj)
            claim_objects.append(claim_obj)
            print(f"   ✅ Claim {i+1} created for {patients[i].name} (Status: {claim_statuses[i]})")
        
        except Exception as e:
            print(f"   ❌ Failed to create claim {i+1}: {str(e)}")
            continue

    db.commit()
    print(f"   ✅ {len(claim_objects)} claims created successfully")

    # 5. Create fraud detections
    print("📋 Step 5: Creating fraud detections...")
    for i, claim_obj in enumerate(claim_objects):
        fraud = FraudDetection(
            id=uuid.uuid4(),
            claim_id=claim_obj.id,
            detection_type=["DUPLICATE_CLAIM", "OVERUTILIZATION", "UPCODING", "FRAUDULENT_BILLING"][i],
            risk_level=["HIGH", "MEDIUM", "LOW", "HIGH"][i],
            confidence=[0.85, 0.65, 0.45, 0.90][i],
            description=f"Fraud detection for claim {claim_obj.id} - {['Possible duplicate', 'High utilization', 'Coding issue', 'Billing anomaly'][i]}",
            details={
                "rule_triggered": f"FRAUD_RULE_{i+1:03d}",
                "analysis_date": datetime.now().isoformat(),
                "suggested_action": ["REVIEW_MANUALLY", "FLAG_FOR_AUDIT", "MONITOR", "REJECT_CLAIM"][i],
                "confidence_score": [0.85, 0.65, 0.45, 0.90][i],
                "affected_areas": ["patient_history", "service_frequency", "diagnosis_coding", "billing_amount"][i],
                "timestamp": datetime.now().isoformat()
            },
            is_resolved=i == 2,  # Mark third one as resolved for testing
            resolved_by=users[0].id if i == 2 else None,
            resolved_at=datetime.now() if i == 2 else None,
            resolved_notes="False positive - normal billing pattern" if i == 2 else None,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.add(fraud)
        print(f"   ✅ Fraud detection {i+1} created (Risk: {['HIGH', 'MEDIUM', 'LOW', 'HIGH'][i]})")

    db.commit()
    
    # 6. Create claim files
    print("📋 Step 6: Creating claim file records...")
    for i, claim_obj in enumerate(claim_objects):
        file_types = ["sep", "rm", "rujukan", "ktp", "kartu"]
        for file_type in file_types:
            claim_file = ClaimFiles(
                id=uuid.uuid4(),
                claim_id=claim_obj.id,
                file_type=file_type,
                file_path=f"/uploads/claims/{claim_obj.id}/{file_type}_{i+1}.pdf",
                checksum=uuid.uuid4().hex[:64],  # Simulate SHA256
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(claim_file)
        print(f"   ✅ 5 file records created for claim {i+1}")

    db.commit()

    print("")
    print("🎉 CLAIMS & FRAUD SYSTEM INITIALIZED SUCCESSFULLY!")
    print("=" * 60)
    print(f"   ✅ {len(sep_objects)} SEP Records")
    print(f"   ✅ {len(rm_objects)} RekamMedis Records") 
    print(f"   ✅ {len(claim_objects)} Claim Submissions")
    print(f"   ✅ 4 Fraud Detections")
    print(f"   ✅ {len(claim_objects) * 5} Claim Files")
    print("   📊 Claim Statuses: UPLOADED, VALIDATED, FRAUD_CHECK, APPROVED")
    print("   🚨 Fraud Risks: HIGH, MEDIUM, LOW, HIGH")
    print("=" * 60)
    
def init_all_data():
    """Initialize all data"""
    db = SessionLocal()
    try:
        print("Starting data initialization...")
        
        # Initialize jenis sarana
        jenis_sarana = init_jenis_sarana(db)
        
        # Initialize roles
        roles = init_roles(db)
        
        # Initialize facilities
        facilities = init_facilities(db)
        
        # Initialize doctors
        doctors = init_doctors(db, facilities)
        
        # Initialize patients
        patients = init_patients(db)
        
        # Initialize medical data
        init_medical_data(db)
        
        # Initialize users
        users = init_users(db, roles, facilities)
        
        # Skip claims and fraud - too complex for initial setup
        init_claims_and_fraud(db, users, patients, facilities)
        
        print("")
        print("🎉 DATA INITIALIZATION COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("📊 DATA SUMMARY:")
        print(f"   ✅ {len(jenis_sarana)} Jenis Sarana")
        print(f"   ✅ {len(roles)} Roles") 
        print(f"   ✅ {len(facilities)} Facilities")
        print(f"   ✅ {len(doctors)} Doctors")
        print(f"   ✅ {len(patients)} Patients")
        print(f"   ✅ {len(users)} Users")
        print(f"   ✅ Medical Data (Diagnosis, Tindakan, Tarif INACBGS)")
        print(f"   ⏭️  Claims & Fraud (Skipped - Complex Dependencies)")
        print("")
        print("🔐 LOGIN CREDENTIALS:")
        print("   👤 Super Admin: superadmin / superadmin123")
        print("   🏥 Admin RS: admin_rsud001 / admin123") 
        print("   📤 Uploader: uploader_rsud001 / uploader123")
        print("   ✅ Validator: validator1 / validator123")
        print("")
        print("🚀 Application is ready at: http://localhost:8000")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error during data initialization: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()