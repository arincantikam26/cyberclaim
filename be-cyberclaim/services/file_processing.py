import os
import hashlib
from typing import List

def calculate_checksum(file_path: str) -> str:
    """Calculate SHA256 checksum of a file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def validate_file_type(file_path: str, allowed_extensions: List[str]) -> bool:
    """Validate file type based on extension"""
    file_extension = os.path.splitext(file_path)[1].lower()
    return file_extension in allowed_extensions

def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    return os.path.getsize(file_path)