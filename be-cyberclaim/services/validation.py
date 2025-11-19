import os
from typing import Dict, Any, List

def validate_claim_documents(extracted_files: List[str]) -> Dict[str, Any]:
    """
    Validasi dokumen-dokumen yang diperlukan dalam claim
    """
    required_files = {
        'sep': ['sep', 'surat eligibilitas'],
        'rm': ['rekam medis', 'medical record'],
        'rujukan': ['rujukan', 'referral'],
        'ktp': ['ktp', 'identitas'],
        'kartu': ['kartu', 'bpjs']
    }
    
    found_files = {}
    validation_errors = []
    
    for file_path in extracted_files:
        filename = os.path.basename(file_path).lower()
        
        for doc_type, keywords in required_files.items():
            if any(keyword in filename for keyword in keywords):
                found_files[doc_type] = file_path
                break
    
    # Check for missing required documents
    missing_docs = []
    for doc_type in ['sep', 'rm', 'rujukan']:  # Required documents
        if doc_type not in found_files:
            missing_docs.append(doc_type)
    
    if missing_docs:
        return {
            "valid": False,
            "message": f"Missing required documents: {', '.join(missing_docs)}"
        }
    
    # Validate file types
    for doc_type, file_path in found_files.items():
        if not file_path.lower().endswith(('.pdf', '.jpg', '.jpeg', '.png')):
            validation_errors.append(f"Invalid file type for {doc_type}: {file_path}")
    
    if validation_errors:
        return {
            "valid": False,
            "message": "; ".join(validation_errors)
        }
    
    return {
        "valid": True,
        "message": "All required documents are present and valid",
        "found_files": found_files
    }