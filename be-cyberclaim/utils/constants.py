# File handling constants
ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.rar']
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Role constants
ROLES = {
    "superadmin": "Super Administrator",
    "admin": "Administrator", 
    "uploader": "Uploader/Faskes",
    "validator": "Validator"
}

# Claim status constants
CLAIM_STATUS = {
    "uploaded": "Uploaded",
    "validated": "Validated", 
    "fraud_check": "Fraud Check",
    "rejected": "Rejected",
    "approved": "Approved"
}

# Jenis Sarana constants
JENIS_SARANA = {
    101: "Praktek mandiri",
    102: "Puskesmas", 
    103: "Klinik",
    104: "Rumah sakit"
}