from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import uuid
from schemas.claim import ClaimStatus

def detect_fraud_patterns(db: Session, claim_id: uuid.UUID) -> List[Dict[str, Any]]:
    """
    Detect various fraud patterns in a claim sesuai spesifikasi
    """
    fraud_detections = []
    
    # Get claim data
    from repositories.claim import get_claim
    from repositories.fraud import create_fraud_detection
    from schemas.fraud import FraudDetectionCreate
    
    claim = get_claim(db, claim_id)
    if not claim:
        return fraud_detections
    
    # Pattern 1: Pengecekan data rekam medis dengan database
    rm_validation = validate_medical_record_data(db, claim)
    if rm_validation["is_fraud"]:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="fictitious_medical_record",
                risk_level="high",
                confidence=0.90,
                description="Data rekam medis tidak valid atau fiktif",
                details=rm_validation["details"]
            )
        )
    
    # Pattern 2: Pengecekan tarif INACBGS
    tariff_validation = validate_inacbgs_tariff(db, claim)
    if tariff_validation["anomaly_detected"]:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="tariff_anomaly",
                risk_level="medium",
                confidence=0.75,
                description="Anomali tarif INACBGS terdeteksi",
                details=tariff_validation["details"]
            )
        )
    
    # Pattern 3: Pengecekan konsistensi data
    consistency_validation = validate_data_consistency(claim)
    if consistency_validation["inconsistencies"]:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="data_inconsistency",
                risk_level="medium",
                confidence=0.80,
                description="Ketidakkonsistenan data terdeteksi",
                details=consistency_validation
            )
        )
    
    # Pattern 4: Pengecekan manipulasi diagnosa
    diagnosis_manipulation = check_diagnosis_manipulation(db, claim)
    if diagnosis_manipulation["manipulation_detected"]:
        fraud_detections.append(
            FraudDetectionCreate(
                claim_id=claim_id,
                detection_type="diagnosis_manipulation",
                risk_level="high",
                confidence=0.85,
                description="Manipulasi diagnosa terdeteksi",
                details=diagnosis_manipulation
            )
        )
    
    # Save fraud detections to database
    for detection in fraud_detections:
        create_fraud_detection(db, detection)
    
    return fraud_detections

def validate_medical_record_data(db: Session, claim) -> Dict[str, Any]:
    """
    Validasi data rekam medis dengan database
    """
    details = {}
    is_fraud = False
    
    # Cek data pasien di rekam medis
    from repositories.patient import get_patient_by_id
    patient = get_patient_by_id(db, claim.patient_id)
    
    if not patient:
        details["patient_check"] = "Data pasien tidak ditemukan di database"
        is_fraud = True
    else:
        # Bandingkan data pasien dengan rekam medis
        if claim.extracted_data and claim.extracted_data.get("rekam_medis"):
            rm_data = claim.extracted_data["rekam_medis"]
            
            # Cek nama pasien
            if rm_data.get("nama_pasien") and patient.name:
                if rm_data["nama_pasien"].lower() != patient.name.lower():
                    details["name_mismatch"] = f"Nama tidak match: DB={patient.name}, RM={rm_data['nama_pasien']}"
                    is_fraud = True
            
            # Cek nomor rekam medis
            if rm_data.get("no_rekam_medis") and patient.medical_record_number:
                if rm_data["no_rekam_medis"] != patient.medical_record_number:
                    details["mr_number_mismatch"] = f"Nomor RM tidak match: DB={patient.medical_record_number}, RM={rm_data['no_rekam_medis']}"
                    is_fraud = True
    
    # Cek dokter DPJP
    from repositories.doctor import get_doctor_by_name
    if claim.extracted_data and claim.extracted_data.get("rekam_medis"):
        dpjp_name = claim.extracted_data["rekam_medis"].get("dokter_dpjp")
        if dpjp_name:
            doctor = get_doctor_by_name(db, dpjp_name)
            if not doctor:
                details["doctor_check"] = f"Dokter DPJP {dpjp_name} tidak terdaftar"
                is_fraud = True
            elif not doctor.is_licensed:
                details["doctor_license"] = f"Dokter {dpjp_name} tidak memiliki lisensi aktif"
                is_fraud = True
    
    return {
        "is_fraud": is_fraud,
        "details": details
    }

def validate_inacbgs_tariff(db: Session, claim) -> Dict[str, Any]:
    """
    Validasi tarif berdasarkan INACBGS
    """
    details = {}
    anomaly_detected = False
    
    from repositories.tariff import get_tariff_by_diagnosis_procedure
    
    if claim.extracted_data and claim.extracted_data.get("rekam_medis"):
        rm_data = claim.extracted_data["rekam_medis"]
        diagnosa = rm_data.get("diagnosa", "")
        tindakan = rm_data.get("tindakan", [])
        
        # Hitung tarif standar
        total_standard_tariff = 0
        claimed_tariff = claim.claimed_amount or 0
        
        # Tarif untuk diagnosa
        diagnosa_tariff = get_tariff_by_diagnosis_procedure(db, diagnosa, None)
        if diagnosa_tariff:
            total_standard_tariff += diagnosa_tariff.tarif_dasar
        
        # Tarif untuk tindakan
        for procedure in tindakan:
            procedure_tariff = get_tariff_by_diagnosis_procedure(db, diagnosa, procedure)
            if procedure_tariff:
                total_standard_tariff += procedure_tariff.tarif_dasar
        
        # Bandingkan dengan tarif yang diklaim
        if claimed_tariff > 0:
            variance = abs(claimed_tariff - total_standard_tariff) / total_standard_tariff if total_standard_tariff > 0 else 1
            if variance > 0.3:  # 30% variance threshold
                anomaly_detected = True
                details["tariff_variance"] = {
                    "claimed": claimed_tariff,
                    "standard": total_standard_tariff,
                    "variance_percent": variance * 100
                }
    
    return {
        "anomaly_detected": anomaly_detected,
        "details": details
    }

def validate_data_consistency(claim) -> Dict[str, Any]:
    """
    Validasi konsistensi data antara SEP, Rekam Medis, dan Surat Rujukan
    """
    inconsistencies = []
    
    if claim.extracted_data:
        sep_data = claim.extracted_data.get("sep", {})
        rm_data = claim.extracted_data.get("rekam_medis", {})
        rujukan_data = claim.extracted_data.get("rujukan", {})
        
        # Cek konsistensi diagnosa
        diagnosa_sep = sep_data.get("diagnosa", "")
        diagnosa_rm = rm_data.get("diagnosa", "")
        diagnosa_rujukan = rujukan_data.get("diagnosa", "")
        
        if diagnosa_sep and diagnosa_rm and diagnosa_sep != diagnosa_rm:
            inconsistencies.append(f"Diagnosa SEP ({diagnosa_sep}) tidak match dengan Rekam Medis ({diagnosa_rm})")
        
        # Cek konsistensi tanggal
        tgl_sep = sep_data.get("tgl_sep")
        tgl_masuk = rm_data.get("tgl_masuk")
        
        if tgl_sep and tgl_masuk:
            try:
                tgl_sep_date = datetime.strptime(tgl_sep, "%Y-%m-%d")
                tgl_masuk_date = datetime.strptime(tgl_masuk, "%Y-%m-%d")
                
                if tgl_sep_date != tgl_masuk_date:
                    inconsistencies.append(f"Tanggal SEP ({tgl_sep}) tidak match dengan tanggal masuk ({tgl_masuk})")
            except:
                pass
        
        # Cek konsistensi dokter DPJP
        dokter_sep = sep_data.get("dokter_dpjp", "")
        dokter_rm = rm_data.get("dokter_dpjp", "")
        
        if dokter_sep and dokter_rm and dokter_sep != dokter_rm:
            inconsistencies.append(f"Dokter DPJP SEP ({dokter_sep}) tidak match dengan Rekam Medis ({dokter_rm})")
    
    return {
        "inconsistencies": inconsistencies,
        "inconsistency_count": len(inconsistencies)
    }

def check_diagnosis_manipulation(db: Session, claim) -> Dict[str, Any]:
    """
    Deteksi manipulasi diagnosa
    """
    manipulation_detected = False
    details = {}
    
    # Cek riwayat diagnosa pasien
    from repositories.claim import get_patient_claim_history
    claim_history = get_patient_claim_history(db, claim.patient_id)
    
    current_diagnosis = ""
    if claim.extracted_data and claim.extracted_data.get("rekam_medis"):
        current_diagnosis = claim.extracted_data["rekam_medis"].get("diagnosa", "")
    
    if current_diagnosis and claim_history:
        # Cek perubahan diagnosa yang mencurigakan
        previous_claims = [ch for ch in claim_history if ch.id != claim.id]
        if previous_claims:
            latest_claim = previous_claims[0]
            previous_diagnosis = latest_claim.extracted_data.get("rekam_medis", {}).get("diagnosa", "") if latest_claim.extracted_data else ""
            
            if previous_diagnosis and current_diagnosis != previous_diagnosis:
                # Deteksi perubahan ke diagnosa dengan tarif lebih tinggi
                current_tariff = get_diagnosis_tariff(db, current_diagnosis)
                previous_tariff = get_diagnosis_tariff(db, previous_diagnosis)
                
                if current_tariff and previous_tariff:
                    if current_tariff > previous_tariff * 1.5:  # 50% increase
                        manipulation_detected = True
                        details = {
                            "previous_diagnosis": previous_diagnosis,
                            "current_diagnosis": current_diagnosis,
                            "tariff_increase_percent": ((current_tariff - previous_tariff) / previous_tariff) * 100
                        }
    
    return {
        "manipulation_detected": manipulation_detected,
        "details": details
    }

def get_diagnosis_tariff(db: Session, diagnosis: str) -> float:
    """
    Get tariff for a diagnosis
    """
    from repositories.tariff import get_tariff_by_diagnosis
    tariff = get_tariff_by_diagnosis(db, diagnosis)
    return tariff.tarif_dasar if tariff else 0