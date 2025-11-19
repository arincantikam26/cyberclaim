# services/fraud_detection.py
from sqlalchemy.orm import Session
from models import FraudDetection
import uuid
import re

class FraudDetectionService:
    def __init__(self, db: Session):
        self.db = db
    
    def check_patient_consistency(self, batch_id: str, faskes_data: dict, bpjs_data: dict):
        """Cek kesesuaian data faskes dengan BPJS"""
        name_match = faskes_data.get("patient_name", "").lower() == bpjs_data.get("patient_name", "").lower()
        id_match = faskes_data.get("patient_id", "") == bpjs_data.get("patient_id", "")
        dob_match = faskes_data.get("date_of_birth", "") == bpjs_data.get("date_of_birth", "")
        
        consistent = name_match and id_match and dob_match
        risk_level = "low" if consistent else "high"
        
        detection = FraudDetection(
            id=uuid.uuid4(),
            batch_id=batch_id,
            detection_type="patient_consistency_check",
            risk_level=risk_level,
            confidence=0.95,
            details={
                "consistent": consistent,
                "name_match": name_match,
                "id_match": id_match,
                "dob_match": dob_match,
                "faskes_data": faskes_data,
                "bpjs_data": bpjs_data
            }
        )
        self.db.add(detection)
        self.db.commit()
        return detection
    
    def detect_diagnosis_manipulation(self, batch_id: str, current_diagnosis: str, previous_diagnosis: str):
        """Deteksi manipulasi diagnosa"""
        # Simple similarity check (in production, use NLP/ML)
        current_clean = re.sub(r'[^\w\s]', '', current_diagnosis.lower())
        previous_clean = re.sub(r'[^\w\s]', '', previous_diagnosis.lower())
        
        words_current = set(current_clean.split())
        words_previous = set(previous_clean.split())
        
        common_words = words_current.intersection(words_previous)
        similarity = len(common_words) / max(len(words_current), len(words_previous)) if words_current or words_previous else 0
        
        manipulation_detected = similarity < 0.3  # Threshold for manipulation
        risk_level = "high" if manipulation_detected else "low"
        
        detection = FraudDetection(
            id=uuid.uuid4(),
            batch_id=batch_id,
            detection_type="diagnosis_manipulation",
            risk_level=risk_level,
            confidence=similarity,
            details={
                "manipulation_detected": manipulation_detected,
                "similarity_score": similarity,
                "current_diagnosis": current_diagnosis,
                "previous_diagnosis": previous_diagnosis
            }
        )
        self.db.add(detection)
        self.db.commit()
        return detection
    
    def detect_fictitious_claims(self, batch_id: str, patient_data: dict, treatment_data: dict):
        """Deteksi klaim fiktif"""
        indicators = []
        
        # Check patient data validity
        if len(patient_data.get("name", "").strip()) < 3:
            indicators.append("invalid_patient_name")
        
        if not re.match(r'^\d{13,16}$', patient_data.get("id", "")):
            indicators.append("invalid_patient_id")
        
        # Check treatment data
        if treatment_data.get("cost", 0) > 100000000:  # 100 juta
            indicators.append("unusually_high_cost")
        
        if len(treatment_data.get("procedures", [])) > 10:
            indicators.append("too_many_procedures")
        
        fictitious_detected = len(indicators) > 0
        risk_level = "high" if fictitious_detected else "low"
        
        detection = FraudDetection(
            id=uuid.uuid4(),
            batch_id=batch_id,
            detection_type="fictitious_claim_detection",
            risk_level=risk_level,
            confidence=0.8 if fictitious_detected else 0.1,
            details={
                "fictitious_detected": fictitious_detected,
                "indicators": indicators,
                "patient_data": patient_data,
                "treatment_data": treatment_data
            }
        )
        self.db.add(detection)
        self.db.commit()
        return detection