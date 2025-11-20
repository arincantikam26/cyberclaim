import os
import hashlib
from typing import List, Dict, Any
import PyPDF2
import tempfile

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

def extract_pdf_pages(pdf_path: str) -> Dict[str, str]:
    """
    Extract text from PDF and separate by pages
    Returns dict with page texts
    """
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            pages_text = {}
            for i, page in enumerate(pdf_reader.pages):
                pages_text[f"page_{i+1}"] = page.extract_text()
            
            return pages_text
    except Exception as e:
        raise Exception(f"Failed to extract PDF pages: {str(e)}")

def identify_document_pages(pages_text: Dict[str, str]) -> Dict[str, Any]:
    """
    Identify which page contains which document type
    Based on keywords in the text
    """
    identified_pages = {
        "sep": None,
        "rekam_medis": None,
        "surat_rujukan": None
    }
    
    sep_keywords = ["sep", "surat eligibilitas peserta", "no sep", "kode dpjp"]
    rm_keywords = ["rekam medis", "medical record", "anamnesa", "pemeriksaan fisik", "diagnosa"]
    rujukan_keywords = ["surat rujukan", "rujukan", "dokter perujuk", "faskes perujuk"]
    
    for page_num, text in pages_text.items():
        text_lower = text.lower()
        
        # Check for SEP
        if any(keyword in text_lower for keyword in sep_keywords):
            identified_pages["sep"] = {
                "page_number": page_num,
                "text": text
            }
        
        # Check for Rekam Medis
        elif any(keyword in text_lower for keyword in rm_keywords):
            identified_pages["rekam_medis"] = {
                "page_number": page_num,
                "text": text
            }
        
        # Check for Surat Rujukan
        elif any(keyword in text_lower for keyword in rujukan_keywords):
            identified_pages["surat_rujukan"] = {
                "page_number": page_num,
                "text": text
            }
    
    return identified_pages

def process_claim_files(pdf_files: List[str]) -> Dict[str, Any]:
    """
    Process claim PDF files and identify document structure
    """
    processing_results = {}
    
    for pdf_file in pdf_files:
        try:
            # Extract pages from PDF
            pages_text = extract_pdf_pages(pdf_file)
            
            # Identify document types in pages
            identified_docs = identify_document_pages(pages_text)
            
            processing_results[pdf_file] = {
                "total_pages": len(pages_text),
                "identified_documents": identified_docs,
                "pages_text": pages_text,
                "processing_success": True
            }
            
        except Exception as e:
            processing_results[pdf_file] = {
                "processing_success": False,
                "error": str(e)
            }
    
    return processing_results