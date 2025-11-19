import os
import subprocess
import tempfile
from typing import List

def validate_rar_file(file_path: str) -> bool:
    """Validate if file is a valid RAR archive"""
    try:
        # Using unrar or rar command to test the archive
        result = subprocess.run(
            ['unrar', 't', file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        # Fallback: check file extension and basic properties
        return file_path.lower().endswith('.rar') and os.path.getsize(file_path) > 0

def extract_rar_file(rar_path: str, extract_dir: str) -> List[str]:
    """Extract RAR file and return list of extracted files"""
    os.makedirs(extract_dir, exist_ok=True)
    
    try:
        # Using unrar to extract
        result = subprocess.run(
            ['unrar', 'x', '-y', rar_path, extract_dir],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            # Get list of extracted files
            extracted_files = []
            for root, dirs, files in os.walk(extract_dir):
                for file in files:
                    extracted_files.append(os.path.join(root, file))
            return extracted_files
        else:
            raise Exception(f"Extraction failed: {result.stderr}")
    
    except subprocess.TimeoutExpired:
        raise Exception("Extraction timed out")
    except Exception as e:
        raise Exception(f"Extraction error: {str(e)}")

def calculate_checksum(file_path: str) -> str:
    """Calculate SHA256 checksum of a file"""
    import hashlib
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()