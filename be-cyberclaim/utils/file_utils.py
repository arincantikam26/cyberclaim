import os
import subprocess
import zipfile
from typing import List


def validate_archive(file_path: str) -> bool:
    """
    Validate RAR or ZIP file automatically.
    - RAR: uses `unrar t`
    - ZIP: uses zipfile testzip()
    """
    file_lower = file_path.lower()

    # =======================
    # ZIP VALIDATION
    # =======================
    if file_lower.endswith(".zip"):
        try:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                corrupt = zip_ref.testzip()
                return corrupt is None
        except:
            return False

    # =======================
    # RAR VALIDATION
    # =======================
    if file_lower.endswith(".rar"):
        try:
            result = subprocess.run(
                ['unrar', 't', file_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.returncode == 0
        except:
            return False

    # Unsupported extension
    return False



def extract_archive(file_path: str, extract_dir: str) -> List[str]:
    """
    Extract RAR or ZIP file automatically.
    Returns list of extracted file paths.
    """
    os.makedirs(extract_dir, exist_ok=True)
    file_lower = file_path.lower()

    # =======================
    # ZIP EXTRACTION
    # =======================
    if file_lower.endswith(".zip"):
        try:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)

            extracted = []
            for root, dirs, files in os.walk(extract_dir):
                for f in files:
                    extracted.append(os.path.join(root, f))
            return extracted

        except Exception as e:
            raise Exception(f"ZIP extraction error: {str(e)}")

    # =======================
    # RAR EXTRACTION
    # =======================
    if file_lower.endswith(".rar"):
        try:
            result = subprocess.run(
                ['unrar', 'x', '-y', file_path, extract_dir],
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode != 0:
                raise Exception(f"RAR extraction failed: {result.stderr}")

            extracted = []
            for root, dirs, files in os.walk(extract_dir):
                for f in files:
                    extracted.append(os.path.join(root, f))
            return extracted

        except subprocess.TimeoutExpired:
            raise Exception("RAR extraction timed out")
        except Exception as e:
            raise Exception(f"RAR extraction error: {str(e)}")

    raise Exception("Unsupported archive format (only .rar & .zip allowed)")


def calculate_checksum(file_path: str) -> str:
    """Calculate SHA256 checksum of a file"""
    import hashlib
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)

    return sha256.hexdigest()
