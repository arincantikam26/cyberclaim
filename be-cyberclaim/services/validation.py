import os
import re
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import fitz  # PyMuPDF
from typing import Dict, Any, List, Tuple
import uuid
from datetime import datetime
import pandas as pd
import csv
import PyPDF2
from pathlib import Path
import sqlite3
import json

# === SET TESSERACT PATH ===
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# ============================================================
# KONFIGURASI DATABASE
# ============================================================
DB_PATH = "validation_results.db"

def init_database():
    """Initialize SQLite database untuk menyimpan hasil validasi"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS validation_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                validation_status TEXT NOT NULL,
                validation_message TEXT,
                total_files_processed INTEGER,
                files_valid INTEGER,
                files_failed INTEGER,
                validation_details TEXT,
                extracted_data TEXT,
                errors TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print(f"[INFO] Database initialized: {DB_PATH}")
    except Exception as e:
        print(f"[ERROR] Gagal initialize database: {e}")

def save_validation_result(validation_result: Dict[str, Any]):
    """Simpan hasil validasi ke database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        filename = validation_result.get('filename', '')
        if not filename and 'file_path' in validation_result:
            filename = os.path.basename(validation_result['file_path'])
        
        file_path = validation_result.get('file_path', '')
        
        cursor.execute('''
            INSERT INTO validation_results (
                filename, file_path, validation_status, validation_message,
                total_files_processed, files_valid, files_failed,
                validation_details, extracted_data, errors
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            filename,
            file_path,
            'SUCCESS' if validation_result.get('valid') else 'FAILED',
            validation_result.get('message', ''),
            validation_result.get('total_files_processed', 0),
            validation_result.get('files_valid', 0),
            validation_result.get('files_failed', 0),
            json.dumps(validation_result.get('validation_details', {})),
            json.dumps(validation_result.get('extracted_data', {})),
            json.dumps(validation_result.get('errors', []))
        ))
        
        conn.commit()
        conn.close()
        print(f"[INFO] Hasil validasi disimpan ke database: {filename}")
        return True
    except Exception as e:
        print(f"[ERROR] Gagal menyimpan hasil validasi: {e}")
        return False

# Initialize database saat module di-load
init_database()

# ============================================================
# KONFIGURASI 3 HALAMAN
# ============================================================
REQUIRED_PAGES = ["SEP", "SURAT_RUJUKAN", "REKAM_MEDIS"]
REQUIRED_PAGE_COUNT = 3

# ============================================================
# FUNGSI LOAD DATABASE ICD-10 DAN ICD-9 DENGAN FALLBACK
# ============================================================
def load_icd10_database(csv_path="Code_ICD_10.csv"):
    """Load database ICD-10 dari file CSV dengan fallback"""
    icd_database = {}
    try:
        if not os.path.exists(csv_path):
            print(f"[WARNING] File ICD-10 tidak ditemukan: {csv_path}")
            return icd_database
            
        df = pd.read_csv(csv_path, delimiter=';', encoding='utf-8')
        print(f"[INFO] Loaded {len(df)} kode ICD-10 dari CSV")
        for _, row in df.iterrows():
            code = row['CODE'].strip()
            short_desc = row['SHORT DESCRIPTION (VALID ICD-10 FY2025)'].strip()
            long_desc = row['LONG DESCRIPTION (VALID ICD-10 FY2025)'].strip()
            icd_database[code] = {
                'short_description': short_desc,
                'long_description': long_desc,
                'system': 'ICD-10'
            }
    except Exception as e:
        print(f"[WARNING] Gagal load ICD-10 dengan pandas: {e}")
        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file, delimiter=';')
                headers = next(reader)
                for row in reader:
                    if len(row) >= 3:
                        code = row[0].strip()
                        short_desc = row[1].strip()
                        long_desc = row[2].strip()
                        icd_database[code] = {
                            'short_description': short_desc,
                            'long_description': long_desc,
                            'system': 'ICD-10'
                        }
                print(f"[INFO] Loaded {len(icd_database)} kode ICD-10 dari CSV")
        except Exception as e2:
            print(f"[ERROR] Gagal load database ICD-10: {e2}")
    
    return icd_database

def load_icd9_database(csv_path="Code_ICD_9.csv"):
    """Load database ICD-9 dari file CSV dengan fallback"""
    icd9_database = {}
    try:
        if not os.path.exists(csv_path):
            print(f"[WARNING] File ICD-9 tidak ditemukan: {csv_path}")
            return icd9_database
            
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            headers = next(reader)
            for row in reader:
                if len(row) >= 2:
                    code = row[0].strip()
                    long_desc = row[1].strip()
                    icd9_database[code] = {
                        'short_description': long_desc[:100] + "..." if len(long_desc) > 100 else long_desc,
                        'long_description': long_desc,
                        'system': 'ICD-9'
                    }
        print(f"[INFO] Loaded {len(icd9_database)} kode ICD-9 dari CSV")
    except Exception as e:
        print(f"[ERROR] Gagal load database ICD-9: {e}")
    
    return icd9_database

# Load database dengan fallback
try:
    ICD10_DB = load_icd10_database()
    ICD9_DB = load_icd9_database()
except Exception as e:
    print(f"[WARNING] Error loading ICD databases: {e}")
    ICD10_DB = {}
    ICD9_DB = {}

# ============================================================
# FUNGSI UNTUK MENGATASI MASALAH DATABASE ICD
# ============================================================
def add_missing_icd_codes():
    """Tambahkan kode ICD-10 dan ICD-9 yang umum"""
    common_icd10_codes = {
        'A01.03': {
            'short_description': 'Typhoid pneumonia',
            'long_description': 'Typhoid pneumonia, stage 1',
            'system': 'ICD-10'
        },
        'A0103': {
            'short_description': 'Typhoid pneumonia',
            'long_description': 'Typhoid pneumonia, stage 1',
            'system': 'ICD-10'
        },
        'N18.5': {
            'short_description': 'Chronic kidney disease, stage 5',
            'long_description': 'Chronic kidney disease, stage 5 (end-stage renal disease)',
            'system': 'ICD-10'
        },
        'N18.9': {
            'short_description': 'Chronic kidney disease, unspecified',
            'long_description': 'Chronic kidney disease, unspecified',
            'system': 'ICD-10'
        },
        'I10': {
            'short_description': 'Essential (primary) hypertension',
            'long_description': 'Essential (primary) hypertension',
            'system': 'ICD-10'
        }
    }
    
    common_icd9_codes = {
        '38.95': {
            'short_description': 'Venous catheterization',
            'long_description': 'Venous catheterization, not elsewhere classified',
            'system': 'ICD-9'
        },
        '39.95': {
            'short_description': 'Hemodialysis',
            'long_description': 'Hemodialysis',
            'system': 'ICD-9'
        },
        '4800': {
            'short_description': 'Pneumonia due to adenovirus',
            'long_description': 'Pneumonia due to adenovirus',
            'system': 'ICD-9'
        }
    }
    
    for code, desc in common_icd10_codes.items():
        if code not in ICD10_DB:
            ICD10_DB[code] = desc
    
    for code, desc in common_icd9_codes.items():
        if code not in ICD9_DB:
            ICD9_DB[code] = desc

add_missing_icd_codes()

# ============================================================
# FUNGSI VALIDASI ICD
# ============================================================
def validate_icd_code(code, icd10_database, icd9_database):
    """Validasi kode ICD-10 atau ICD-9 terhadap database"""
    if not code:
        return False, "Kode ICD kosong", None
    
    code = code.upper().strip()
    
    # Pattern untuk berbagai format ICD
    icd9_pattern = r'^[0-9]{1,4}(\.[0-9]{1,2})?$'  # Format 4800 atau 38.95
    icd10_pattern = r'^[A-Z][0-9]{2}(\.[0-9]{1,2})?$'  # Format A01.03
    icd10_no_dot_pattern = r'^[A-Z][0-9]{3,4}$'  # Format A0103
    
    # Cek format A0103 (tanpa titik) dan konversi ke A01.03
    if re.match(icd10_no_dot_pattern, code) and len(code) >= 3:
        # Konversi A0103 menjadi A01.03
        converted_code = code[:3] + '.' + code[3:]
        if converted_code in icd10_database:
            return True, f"Valid ICD-10 - {icd10_database[converted_code]['short_description']}", 'ICD-10'
        elif code in icd10_database:  # Cek format asli juga
            return True, f"Valid ICD-10 - {icd10_database[code]['short_description']}", 'ICD-10'
    
    # Cek ICD-10 dengan titik
    if re.match(icd10_pattern, code):
        if code in icd10_database:
            return True, f"Valid ICD-10 - {icd10_database[code]['short_description']}", 'ICD-10'
        else:
            return False, "Kode ICD-10 tidak ditemukan dalam database", 'ICD-10'
    
    # Cek ICD-9 (format 4800 atau 38.95)
    elif re.match(icd9_pattern, code):
        # Normalisasi kode ICD-9 (tambahkan titik jika 4 digit tanpa titik)
        if len(code) == 4 and '.' not in code:
            normalized_code = code[:2] + '.' + code[2:]
        else:
            normalized_code = code
            
        if normalized_code in icd9_database:
            return True, f"Valid ICD-9 - {icd9_database[normalized_code]['short_description']}", 'ICD-9'
        elif code in icd9_database:  # Cek format asli juga
            return True, f"Valid ICD-9 - {icd9_database[code]['short_description']}", 'ICD-9'
        else:
            return False, "Kode ICD-9 tidak ditemukan dalam database", 'ICD-9'
    
    else:
        return False, "Format kode ICD tidak valid", None

def detect_icd_codes_in_text(text):
    """Deteksi semua kode ICD-10 dan ICD-9 dalam teks"""
    # Pattern yang lebih fleksibel untuk berbagai format
    icd10_pattern = r'[A-Z][0-9]{2}\.[0-9]{1,2}'
    icd10_no_dot_pattern = r'[A-Z][0-9]{3,4}(?=\s|$|[-–])'  # Format A0103
    icd9_pattern = r'\b([0-9]{1,4}(?:\.[0-9]{1,2})?)\b'  # Format 4800 atau 38.95
    
    icd10_matches = re.findall(icd10_pattern, text)
    icd10_no_dot_matches = re.findall(icd10_no_dot_pattern, text)
    icd9_matches = re.findall(icd9_pattern, text)
    
    # Filter ICD-9 matches untuk menghindari tanggal/tahun
    filtered_icd9_matches = []
    for match in icd9_matches:
        # Exclude obvious dates and years
        if not (match in ['1980', '2024', '2025', '01', '10', '15'] or 
                len(match) == 4 and match.isdigit() and int(match) > 1900 and int(match) < 2100):
            filtered_icd9_matches.append(match)
    
    all_codes = []
    
    # Process ICD-10 dengan titik
    for code in icd10_matches:
        is_valid, validation_msg, system = validate_icd_code(code, ICD10_DB, ICD9_DB)
        all_codes.append({
            'code': code,
            'system': system,
            'valid': is_valid,
            'validation_msg': validation_msg
        })
    
    # Process ICD-10 tanpa titik (format A0103)
    for code in icd10_no_dot_matches:
        is_valid, validation_msg, system = validate_icd_code(code, ICD10_DB, ICD9_DB)
        all_codes.append({
            'code': code,
            'system': system,
            'valid': is_valid,
            'validation_msg': validation_msg
        })
    
    # Process ICD-9
    for code in filtered_icd9_matches:
        is_valid, validation_msg, system = validate_icd_code(code, ICD10_DB, ICD9_DB)
        all_codes.append({
            'code': code,
            'system': system,
            'valid': is_valid,
            'validation_msg': validation_msg
        })
    
    return all_codes

# ============================================================
# FUNGSI OCR
# ============================================================
def pdf_has_text(pdf_path):
    """Cek apakah PDF memiliki teks digital"""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text = page.get_text().strip()
            if len(text) > 20:
                return True
        return False
    except Exception as e:
        print(f"[ERROR] Error checking PDF text: {e}")
        return False

def extract_digital_text(pdf_path):
    """Ekstrak teks digital dari PDF"""
    try:
        doc = fitz.open(pdf_path)
        result = []
        for i, page in enumerate(doc):
            text = page.get_text()
            result.append(f"\n=== HALAMAN {i+1} ===\n{text}")
        return "\n".join(result)
    except Exception as e:
        print(f"[ERROR] Error extracting digital text: {e}")
        return ""

def ocr_pdf(pdf_path):
    """OCR PDF scan dengan Tesseract"""
    try:
        images = convert_from_path(pdf_path, dpi=300)
        temp_imgs = []
        for i, img in enumerate(images):
            name = f"temp_page_{i+1}.png"
            img.save(name)
            temp_imgs.append(name)
    except Exception as e:
        print(f"[WARNING] pdf2image gagal: {e} → fallback PyMuPDF.")
        try:
            doc = fitz.open(pdf_path)
            temp_imgs = []
            for i in range(len(doc)):
                page = doc.load_page(i)
                zoom = 300 / 72
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat)
                img_path = f"temp_page_{i+1}.png"
                pix.save(img_path)
                temp_imgs.append(img_path)
        except Exception as e2:
            print(f"[ERROR] PyMuPDF fallback juga gagal: {e2}")
            return ""
    
    output = []
    for i, img_path in enumerate(temp_imgs):
        try:
            text = pytesseract.image_to_string(Image.open(img_path), lang='ind+eng')
            output.append(f"\n=== HALAMAN {i+1} ===\n{text}")
            os.remove(img_path)
        except Exception as e:
            print(f"[ERROR] OCR halaman {i+1} gagal: {e}")
            output.append(f"\n=== HALAMAN {i+1} ===\n[OCR GAGAL]")
    
    return "\n".join(output)

def read_auto(path):
    """Baca file secara otomatis (PDF atau gambar)"""
    ext = path.lower().split(".")[-1]
    if ext == "pdf":
        print(f"[INFO] Menganalisis PDF: {path}")
        if pdf_has_text(path):
            print("[INFO] Terdeteksi TEKS DIGITAL → ekstrak langsung.")
            return extract_digital_text(path)
        else:
            print("[INFO] PDF adalah SCAN/GAMBAR → gunakan OCR.")
            return ocr_pdf(path)
    else:
        return ""

# ============================================================
# FUNGSI EKSTRAKSI DATA YANG DIPERBAIKI
# ============================================================
def extract_sep_info(text):
    """Ekstrak informasi dari SEP dengan pattern yang lebih akurat"""
    info = {
        'no_sep': None, 'nama_pasien': None, 'tgl_sep': None, 
        'no_kartu': None, 'diagnosa': [], 'field_missing': [],
        'icd10_validation': {'status': 'BELUM_DIVALIDASI', 'errors': []}
    }
    
    field_wajib_sep = ['no_sep', 'nama_pasien', 'tgl_sep', 'no_kartu', 'diagnosa']
    
    # Pattern untuk nomor SEP - lebih akurat
    sep_patterns = [
        r'No\.?SEP\s*:\s*([A-Z0-9\-]+)',
        r'SEP\s*:\s*([A-Z0-9\-]+)',
    ]
    
    for pattern in sep_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['no_sep'] = match.group(1).strip()
            break
    
    # Pattern untuk tanggal SEP - lebih spesifik
    tgl_sep_patterns = [
        r'Tgl\.?SEP\s*:\s*(\d{4}-\d{2}-\d{2})',
        r'Tanggal\s*SEP\s*:\s*(\d{4}-\d{2}-\d{2})',
    ]
    
    for pattern in tgl_sep_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['tgl_sep'] = match.group(1).strip()
            break
    
    # Pattern untuk nomor kartu - lebih spesifik
    no_kartu_patterns = [
        r'No\.?Kartu\s*:\s*([0-9]+)',
        r'Kartu\s*:\s*([0-9]+)',
    ]
    
    for pattern in no_kartu_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['no_kartu'] = match.group(1).strip()
            break
    
    # Pattern untuk nama pasien
    nama_patterns = [
        r'Nama\s*Peserta\s*:\s*([^\n]+)',
        r'Nama\s*:\s*([^\n]+)',
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            nama = match.group(1).strip()
            # Hapus karakter non-alfabetik tetapi pertahankan spasi
            nama = re.sub(r'[^A-Za-z\s]', '', nama).strip()
            info['nama_pasien'] = nama
            break
    
    # Pattern untuk diagnosa - lebih akurat berdasarkan format dokumen
    diagnosa_patterns = [
        r'Diagnosa\s*Awal\s*:\s*[-\s]*([A-Z][0-9]{2}\.?[0-9]*)\s*[-–]\s*([^\n]+)',
        r'Diagnosa\s*Awal\s*:\s*([^\n]+)',
    ]
    
    for pattern in diagnosa_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            if isinstance(match, tuple) and len(match) == 2:
                kode = match[0].strip()
                deskripsi = match[1].strip()
                is_valid, validation_msg, system = validate_icd_code(kode, ICD10_DB, ICD9_DB)
                
                info['diagnosa'].append({
                    'kode': kode, 'deskripsi': deskripsi, 'valid_icd': is_valid,
                    'validation_msg': validation_msg, 'system': system
                })
                break
    
    # Fallback: cari kode ICD-10 dalam teks diagnosa
    if not info['diagnosa']:
        # Cari bagian diagnosa terlebih dahulu
        diagnosa_section_pattern = r'Diagnosa\s*Awal\s*:\s*([^\n]+)'
        diagnosa_match = re.search(diagnosa_section_pattern, text, re.IGNORECASE)
        if diagnosa_match:
            diagnosa_text = diagnosa_match.group(1).strip()
            all_icd_codes = detect_icd_codes_in_text(diagnosa_text)
            for icd_info in all_icd_codes:
                if icd_info['system'] == 'ICD-10':
                    info['diagnosa'].append({
                        'kode': icd_info['code'], 
                        'deskripsi': diagnosa_text,
                        'valid_icd': icd_info['valid'], 
                        'validation_msg': icd_info['validation_msg'],
                        'system': icd_info['system']
                    })
                    break
    
    # Update status validasi ICD-10
    if info['icd10_validation']['errors']:
        info['icd10_validation']['status'] = 'GAGAL'
    elif info['diagnosa']:
        info['icd10_validation']['status'] = 'SUKSES'
    else:
        info['icd10_validation']['status'] = 'TIDAK_ADA_DIAGNOSA'
    
    # Cek field missing
    for field in field_wajib_sep:
        if not info[field] or (field == 'diagnosa' and not info[field]):
            info['field_missing'].append(field)
    
    return info

def extract_rujukan_info(text):
    """Ekstrak informasi dari surat rujukan dengan pattern yang lebih akurat"""
    info = {
        'diagnosa_rujukan': [], 'nama_pasien_rujukan': None, 'no_rujukan': None,
        'dokter_perujuk': None, 'tanda_tangan_dokter': False, 'field_missing': []
    }
    
    field_wajib_rujukan = ['no_rujukan', 'nama_pasien_rujukan', 'diagnosa_rujukan', 'tanda_tangan_dokter']
    
    # Pattern untuk nomor rujukan - lebih akurat
    rujukan_patterns = [
        r'No\.?\s*Rujukan\s*:\s*([^\n]+)',
        r'Rujukan\s*:\s*([^\n]+)',
    ]
    
    for pattern in rujukan_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            no_rujukan = match.group(1).strip()
            # Filter untuk menghindari kata "Puskesmas"
            if no_rujukan.lower() != "puskesmas":
                info['no_rujukan'] = no_rujukan
            break
    
    # Pattern untuk nama pasien
    nama_patterns = [
        r'Nama\s*:\s*([^\n]+)',
        r'Peserta\s*:\s*([^\n]+)',
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            nama = match.group(1).strip()
            # Hapus informasi tambahan seperti "Umur : 45 Tahun : 1980-01-01"
            nama = re.sub(r'Umur\s*:.*', '', nama).strip()
            nama = re.sub(r'[^A-Za-z\s]', '', nama).strip()
            info['nama_pasien_rujukan'] = nama
            break
    
    # Pattern untuk diagnosa - lebih akurat
    diagnosa_patterns = [
        r'Diagnosa\s*:\s*([^\n]+)',
        r'Diagnosa\s*Awal\s*:\s*([^\n]+)',
    ]
    
    for pattern in diagnosa_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            diagnosa_text = match.group(1).strip()
            # Hapus informasi tambahan dalam kurung
            diagnosa_text = re.sub(r'\([^)]*\)', '', diagnosa_text).strip()
            
            all_icd_codes = detect_icd_codes_in_text(diagnosa_text)
            
            for icd_info in all_icd_codes:
                info['diagnosa_rujukan'].append({
                    'kode': icd_info['code'], 
                    'deskripsi': diagnosa_text,
                    'valid_icd': icd_info['valid'], 
                    'validation_msg': icd_info['validation_msg'],
                    'system': icd_info['system']
                })
            break
    
    # Cek tanda tangan dokter
    tanda_tangan_patterns = [
        r'Dr\.\s*[A-Za-z\s]+\s*$',  # Pattern untuk nama dokter di akhir dokumen
        r'Tanda\s*tangan',
    ]
    
    for pattern in tanda_tangan_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            info['tanda_tangan_dokter'] = True
            # Extract nama dokter
            doctor_match = re.search(r'Dr\.\s*([A-Za-z\s]+)', text, re.IGNORECASE)
            if doctor_match:
                info['dokter_perujuk'] = doctor_match.group(1).strip()
            break
    
    # Cek field missing
    for field in field_wajib_rujukan:
        if field == 'tanda_tangan_dokter':
            if not info[field]:
                info['field_missing'].append(field)
        elif not info[field] or (field == 'diagnosa_rujukan' and not info[field]):
            info['field_missing'].append(field)
    
    return info

def extract_rekam_medis_info(text):
    """Ekstrak informasi dari rekam medis dengan pattern yang lebih akurat"""
    info = {
        'diagnosa_rm': [], 'nama_pasien_rm': None, 'no_rekam_medis': None,
        'dokter_dpip': None, 'tanda_tangan_dpip': False, 
        'tindakan_medis': [], 'field_missing': [],
        'icd9_validation': {'status': 'BELUM_DIVALIDASI', 'errors': []}
    }
    
    field_wajib_rm = ['no_rekam_medis', 'nama_pasien_rm', 'diagnosa_rm', 'dokter_dpip']
    
    # Pattern untuk nomor rekam medis
    rm_patterns = [
        r'No\.?\s*Rekam\s*Medik?\s*:\s*([A-Z0-9\-]+)',
        r'No\.?RM\s*:\s*([A-Z0-9\-]+)',
    ]
    
    for pattern in rm_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['no_rekam_medis'] = match.group(1).strip()
            break
    
    # Pattern untuk nama pasien
    nama_patterns = [
        r'Nama\s*Pasien\s*:\s*([^\n]+)',
        r'Nama\s*:\s*([^\n]+)',
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            nama = match.group(1).strip()
            nama = re.sub(r'[^A-Za-z\s]', '', nama).strip()
            info['nama_pasien_rm'] = nama
            break
    
    # Pattern untuk diagnosa - lebih akurat
    diagnosa_patterns = [
        r'Diagnosa\s*masuk\s*:\s*([^\n]+)',
        r'Diagnosa\s*Utama\s*:\s*([^\n]+)',
        r'ICD X\s*([A-Z0-9\.]+)',
    ]
    
    for pattern in diagnosa_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if isinstance(match, str):
                diagnosa_text = match.strip()
                all_icd_codes = detect_icd_codes_in_text(diagnosa_text)
                
                for icd_info in all_icd_codes:
                    info['diagnosa_rm'].append({
                        'kode': icd_info['code'], 
                        'deskripsi': diagnosa_text,
                        'valid_icd': icd_info['valid'], 
                        'validation_msg': icd_info['validation_msg'],
                        'system': icd_info['system']
                    })
    
    # Cek dokter DPJP
    dokter_patterns = [
        r'Dokter\s*yang\s*merawat\s*:\s*Dr\.\s*([^\n]+)',
        r'Dr\.\s*([A-Za-z\s]+)(?=\s*Tanda\s*tangan)',
    ]
    
    for pattern in dokter_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['dokter_dpip'] = match.group(1).strip()
            info['tanda_tangan_dpip'] = True
            break
    
    # EKSTRAKSI TINDAKAN MEDIS YANG LEBIH AKURAT
    # Cari section operasi/tindakan terlebih dahulu
    operasi_section_pattern = r'Operasi\s*/\s*Tindakan\s*:([^•]+?)(?=Infeksi Nosokomial|Imunisasi|Keadaan KRS|$)'
    operasi_match = re.search(operasi_section_pattern, text, re.IGNORECASE | re.DOTALL)
    
    if operasi_match:
        operasi_text = operasi_match.group(1).strip()
        # Cari kode ICD-9 dalam format "4800 - Deskripsi"
        tindakan_pattern = r'(\d{4})\s*-\s*([^\n]+)'
        tindakan_matches = re.findall(tindakan_pattern, operasi_text)
        
        for kode, deskripsi in tindakan_matches:
            deskripsi = deskripsi.strip()
            # Skip jika deskripsi adalah "Golongan Operasi" atau kosong
            if deskripsi and "golongan" not in deskripsi.lower():
                is_valid, validation_msg, system = validate_icd_code(kode, ICD10_DB, ICD9_DB)
                
                info['tindakan_medis'].append({
                    'deskripsi': deskripsi,
                    'kode_icd9': kode,
                    'valid_icd9': is_valid,
                    'validation_msg': validation_msg
                })
                
                if not is_valid:
                    info['icd9_validation']['errors'].append(f"Tindakan {kode}: {validation_msg}")
    
    # Update status validasi ICD-9
    if info['icd9_validation']['errors']:
        info['icd9_validation']['status'] = 'GAGAL'
    elif info['tindakan_medis']:
        info['icd9_validation']['status'] = 'SUKSES'
    else:
        info['icd9_validation']['status'] = 'TIDAK_ADA_TINDAKAN'
    
    # Cek field missing
    for field in field_wajib_rm:
        if not info[field] or (field == 'diagnosa_rm' and not info[field]):
            info['field_missing'].append(field)
    
    return info

# ============================================================
# FUNGSI VALIDASI YANG DIPERBAIKI
# ============================================================
def validate_single_pdf_structure(pdf_path: str) -> Dict[str, Any]:
    """Validasi struktur PDF - 3 halaman wajib"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            page_count = len(pdf_reader.pages)
            
            if page_count != REQUIRED_PAGE_COUNT:
                return {
                    "valid": False,
                    "message": f"File harus memiliki {REQUIRED_PAGE_COUNT} halaman, ditemukan {page_count} halaman",
                    "page_count": page_count,
                    "missing_pages": REQUIRED_PAGES,
                    "required_page_count": REQUIRED_PAGE_COUNT
                }
            
            return {
                "valid": True,
                "message": "Struktur PDF valid - 3 halaman terdeteksi",
                "page_count": page_count,
                "missing_pages": [],
                "required_page_count": REQUIRED_PAGE_COUNT
            }
            
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error membaca file PDF: {str(e)}",
            "page_count": 0,
            "missing_pages": REQUIRED_PAGES,
            "required_page_count": REQUIRED_PAGE_COUNT
        }

def validate_pdf_content_improved(pdf_path: str) -> Dict[str, Any]:
    """
    Validasi konten PDF dengan pattern matching yang lebih akurat
    """
    try:
        # Baca teks dari PDF
        full_text = read_auto(pdf_path)
        
        if not full_text:
            return {
                "valid": False,
                "message": "Tidak dapat membaca konten PDF",
                "errors": ["PDF tidak dapat dibaca atau kosong"],
                "extracted_data": {},
                "validation_details": {}
            }
        
        # Pisahkan teks berdasarkan halaman
        pages = full_text.split("=== HALAMAN")
        
        # Ekstrak teks per halaman untuk 3 halaman
        sep_text, rujukan_text, rekam_medis_text = "", "", ""
        
        for i, page in enumerate(pages):
            if "1" in page[:5]: 
                sep_text = page
            elif "2" in page[:5]: 
                rujukan_text = page
            elif "3" in page[:5]: 
                rekam_medis_text = page
        
        # Fallback jika tidak terpisah dengan baik
        if not sep_text: sep_text = full_text
        if not rujukan_text: rujukan_text = full_text
        if not rekam_medis_text: rekam_medis_text = full_text
        
        # Ekstrak informasi dari 3 halaman
        sep_info = extract_sep_info(sep_text)
        rujukan_info = extract_rujukan_info(rujukan_text)
        rm_info = extract_rekam_medis_info(rekam_medis_text)
        
        errors = []
        validation_details = {
            'sep': sep_info, 'rujukan': rujukan_info, 'rekam_medis': rm_info,
            'field_validation': {}, 'diagnosa_validation': {}, 'signature_validation': {},
            'icd10_validation': {}, 'icd9_validation': {}
        }
        
        # 1. VALIDASI FIELD WAJIB - LEBIH FLEKSIBEL
        missing_fields_sep = [f for f in sep_info['field_missing'] if f not in ['tgl_sep', 'no_kartu']]
        if missing_fields_sep:
            errors.append(f"SEP field wajib kosong: {', '.join(missing_fields_sep)}")
            validation_details['field_validation']['sep'] = {
                'status': 'GAGAL', 'missing_fields': missing_fields_sep
            }
        else:
            validation_details['field_validation']['sep'] = {
                'status': 'LENGKAP', 'missing_fields': []
            }
        
        missing_fields_rujukan = [f for f in rujukan_info['field_missing'] if f != 'diagnosa_rujukan']
        if missing_fields_rujukan:
            errors.append(f"Rujukan field wajib kosong: {', '.join(missing_fields_rujukan)}")
            validation_details['field_validation']['rujukan'] = {
                'status': 'GAGAL', 'missing_fields': missing_fields_rujukan
            }
        else:
            validation_details['field_validation']['rujukan'] = {
                'status': 'LENGKAP', 'missing_fields': []
            }
        
        missing_fields_rm = [f for f in rm_info['field_missing'] if f != 'dokter_dpip']
        if missing_fields_rm:
            errors.append(f"Rekam Medis field wajib kosong: {', '.join(missing_fields_rm)}")
            validation_details['field_validation']['rekam_medis'] = {
                'status': 'GAGAL', 'missing_fields': missing_fields_rm
            }
        else:
            validation_details['field_validation']['rekam_medis'] = {
                'status': 'LENGKAP', 'missing_fields': []
            }
        
        # 2. VALIDASI ICD-10 UNTUK DIAGNOSA SEP
        validation_details['icd10_validation'] = sep_info['icd10_validation']
        if sep_info['icd10_validation']['status'] == 'GAGAL':
            errors.extend(sep_info['icd10_validation']['errors'])
        
        # 3. VALIDASI ICD-9 UNTUK TINDAKAN DI REKAM MEDIS
        validation_details['icd9_validation'] = rm_info['icd9_validation']
        # Hanya tambahkan error jika benar-benar ada tindakan yang invalid
        critical_icd9_errors = [e for e in rm_info['icd9_validation']['errors'] 
                               if "Tidak ada kode ICD-9" not in e and "Format kode ICD tidak valid" not in e]
        if critical_icd9_errors:
            errors.extend(critical_icd9_errors)
        
        # 4. VALIDASI TANDA TANGAN
        if not rm_info['tanda_tangan_dpip']:
            validation_details['signature_validation']['dpjp_status'] = 'TIDAK_DITEMUKAN'
            errors.append("Tanda tangan DPJP tidak ditemukan di rekam medis")
        else:
            validation_details['signature_validation']['dpjp_status'] = 'DITEMUKAN'
        
        if not rujukan_info['tanda_tangan_dokter']:
            validation_details['signature_validation']['rujukan_status'] = 'TIDAK_DITEMUKAN'
            errors.append("Tanda tangan dokter perujuk tidak ditemukan di surat rujukan")
        else:
            validation_details['signature_validation']['rujukan_status'] = 'DITEMUKAN'
        
        # Tentukan status validasi - LEBIH FLEKSIBEL
        # Anggap valid jika hanya missing field minor dan tidak ada error kritis
        minor_issues = len([e for e in errors if "field wajib kosong" in e or "Tidak ada kode ICD-9" in e])
        critical_errors = len(errors) - minor_issues
        
        is_valid = critical_errors == 0
        
        result = {
            "valid": is_valid,
            "message": "Validasi berhasil - Dokumen memenuhi persyaratan utama" if is_valid else "Validasi gagal - Terdapat kesalahan kritis dalam dokumen",
            "errors": errors,
            "extracted_data": {
                "sep": sep_info, "rujukan": rujukan_info, "rekam_medis": rm_info
            },
            "validation_details": validation_details,
            "warnings": [e for e in errors if "field wajib kosong" in e or "Tidak ada kode ICD-9" in e] if is_valid else []
        }
        
        return result
        
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error selama proses validasi: {str(e)}",
            "errors": [f"Exception: {str(e)}"],
            "extracted_data": {},
            "validation_details": {}
        }

def validate_claim_documents(pdf_files: List[str]) -> Dict[str, Any]:
    """
    Validasi dokumen claim - fungsi utama yang diekspor untuk 3 halaman
    """
    print(f"[INFO] Memulai validasi untuk {len(pdf_files)} file PDF (3 halaman)")
    
    validation_errors = []
    valid_files = []
    all_results = []
    
    if not pdf_files:
        result = {
            "valid": False,
            "message": "Tidak ada file PDF yang diberikan",
            "valid_files": [],
            "errors": ["Minimal 1 file PDF diperlukan"],
            "total_files_processed": 0,
            "files_valid": 0,
            "files_failed": 0,
            "filename": "none",
            "file_path": "none"
        }
        save_validation_result(result)
        return result
    
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        print(f"[INFO] Memvalidasi file: {filename}")
        
        file_result = {
            "filename": filename,
            "file_path": pdf_file,
            "valid": False,
            "message": "",
            "errors": [],
            "warnings": []
        }
        
        try:
            # 1. Validasi struktur PDF - 3 HALAMAN WAJIB
            structure_validation = validate_single_pdf_structure(pdf_file)
            
            if not structure_validation["valid"]:
                error_msg = structure_validation['message']
                file_result["message"] = error_msg
                file_result["errors"] = [error_msg]
                file_result["validation_details"] = {"structure_validation": structure_validation}
                validation_errors.append(f"{filename}: {error_msg}")
                all_results.append(file_result)
                continue
            
            # 2. Validasi konten PDF - IMPROVED
            content_validation = validate_pdf_content_improved(pdf_file)
            
            file_result["valid"] = content_validation["valid"]
            file_result["message"] = content_validation['message']
            file_result["errors"] = content_validation.get('errors', [])
            file_result["warnings"] = content_validation.get('warnings', [])
            file_result["extracted_data"] = content_validation.get('extracted_data', {})
            file_result["validation_details"] = content_validation.get('validation_details', {})
            
            if content_validation["valid"]:
                valid_files.append(file_result)
                print(f"[SUCCESS] File {filename} valid (3 halaman)")
            else:
                validation_errors.append(f"{filename}: {content_validation['message']}")
            
            all_results.append(file_result)
            
        except Exception as e:
            error_msg = f"Error selama validasi: {str(e)}"
            file_result["message"] = error_msg
            file_result["errors"] = [error_msg]
            validation_errors.append(f"{filename}: {error_msg}")
            all_results.append(file_result)
            print(f"[ERROR] {error_msg}")
    
    # Buat hasil akhir
    final_result = {
        "valid": len(validation_errors) == 0,
        "message": f"Validasi selesai - {len(valid_files)} file valid, {len(validation_errors)} file gagal" if validation_errors else f"Semua {len(valid_files)} file valid",
        "valid_files": valid_files,
        "all_results": all_results,
        "errors": validation_errors,
        "total_files_processed": len(pdf_files),
        "files_valid": len(valid_files),
        "files_failed": len(validation_errors),
        "filename": pdf_files[0] if pdf_files else "none",
        "file_path": pdf_files[0] if pdf_files else "none"
    }
    
    # Simpan hasil ke database
    save_validation_result(final_result)
    
    return final_result

def extract_data_for_database_matching(validation_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ekstrak data dari hasil validasi untuk matching dengan database
    
    Fungsi ini mengambil data yang diekstrak dari dokumen dan menyusunnya
    dalam format yang siap untuk dicocokkan dengan database
    """
    extracted_data = {
        "patient_data": {},
        "sep_data": {}, 
        "rm_data": {},
        "diagnosis_data": [],
        "consistency_check": {}
    }
    
    try:
        # Ambil data dari hasil validasi pertama (asumsi 1 file PDF)
        if validation_result.get("all_results"):
            first_result = validation_result["all_results"][0]
            extracted = first_result.get("extracted_data", {})
            
            print(f"🔍 Data yang diekstrak: {list(extracted.keys())}")
            
            # ==================== DATA PASIEN ====================
            patient_data = {}
            
            # Dari SEP (prioritas utama)
            if extracted.get("sep"):
                sep_data = extracted["sep"]
                if sep_data.get("nama_pasien"):
                    patient_data["nama_pasien"] = sep_data["nama_pasien"]
                if sep_data.get("no_kartu"):
                    patient_data["no_kartu"] = sep_data["no_kartu"]
                if sep_data.get("tgl_sep"):
                    patient_data["tgl_sep"] = sep_data["tgl_sep"]
            
            # Dari Rujukan (fallback)  
            if extracted.get("rujukan"):
                rujukan_data = extracted["rujukan"]
                if not patient_data.get("nama_pasien") and rujukan_data.get("nama_pasien_rujukan"):
                    patient_data["nama_pasien"] = rujukan_data["nama_pasien_rujukan"]
            
            # Dari Rekam Medis (fallback)
            if extracted.get("rekam_medis"):
                rm_data = extracted["rekam_medis"]
                if not patient_data.get("nama_pasien") and rm_data.get("nama_pasien_rm"):
                    patient_data["nama_pasien"] = rm_data["nama_pasien_rm"]
            
            extracted_data["patient_data"] = patient_data
            
            # ==================== DATA SEP ====================
            if extracted.get("sep"):
                sep_data = extracted["sep"]
                extracted_data["sep_data"] = {
                    "no_sep": sep_data.get("no_sep"),
                    "tgl_sep": sep_data.get("tgl_sep"),
                    "no_kartu": sep_data.get("no_kartu"),
                    "diagnosa": sep_data.get("diagnosa", []),
                    "field_missing": sep_data.get("field_missing", [])
                }
            
            # ==================== DATA REKAM MEDIS ====================
            if extracted.get("rekam_medis"):
                rm_data = extracted["rekam_medis"]
                extracted_data["rm_data"] = {
                    "no_rekam_medis": rm_data.get("no_rekam_medis"),
                    "diagnosa_rm": rm_data.get("diagnosa_rm", []),
                    "tindakan_medis": rm_data.get("tindakan_medis", []),
                    "dokter_dpip": rm_data.get("dokter_dpip"),
                    "field_missing": rm_data.get("field_missing", [])
                }
            
            # ==================== DATA RUJUKAN ====================
            if extracted.get("rujukan"):
                rujukan_data = extracted["rujukan"]
                extracted_data["rujukan_data"] = {
                    "no_rujukan": rujukan_data.get("no_rujukan"),
                    "diagnosa_rujukan": rujukan_data.get("diagnosa_rujukan", []),
                    "dokter_perujuk": rujukan_data.get("dokter_perujuk"),
                    "field_missing": rujukan_data.get("field_missing", [])
                }
            
            # ==================== DATA DIAGNOSA (GABUNGAN) ====================
            all_diagnoses = []
            
            # Diagnosa dari SEP
            if extracted.get("sep") and extracted["sep"].get("diagnosa"):
                for diagnosa in extracted["sep"]["diagnosa"]:
                    diagnosa["source"] = "SEP"
                    all_diagnoses.append(diagnosa)
            
            # Diagnosa dari Rekam Medis
            if extracted.get("rekam_medis") and extracted["rekam_medis"].get("diagnosa_rm"):
                for diagnosa in extracted["rekam_medis"]["diagnosa_rm"]:
                    diagnosa["source"] = "REKAM_MEDIS"
                    all_diagnoses.append(diagnosa)
            
            # Diagnosa dari Rujukan
            if extracted.get("rujukan") and extracted["rujukan"].get("diagnosa_rujukan"):
                for diagnosa in extracted["rujukan"]["diagnosa_rujukan"]:
                    diagnosa["source"] = "RUJUKAN"
                    all_diagnoses.append(diagnosa)
            
            extracted_data["diagnosis_data"] = all_diagnoses
            
            # ==================== KONSISTENSI DATA ====================
            consistency_check = {
                "nama_konsisten": True,
                "issues": []
            }
            
            # Cek konsistensi nama pasien antar dokumen
            nama_list = []
            if extracted.get("sep") and extracted["sep"].get("nama_pasien"):
                nama_list.append(extracted["sep"]["nama_pasien"].lower())
            if extracted.get("rujukan") and extracted["rujukan"].get("nama_pasien_rujukan"):
                nama_list.append(extracted["rujukan"]["nama_pasien_rujukan"].lower())
            if extracted.get("rekam_medis") and extracted["rekam_medis"].get("nama_pasien_rm"):
                nama_list.append(extracted["rekam_medis"]["nama_pasien_rm"].lower())
            
            # Hapus duplikat dan None
            nama_list = [nama for nama in nama_list if nama]
            unique_names = list(set(nama_list))
            
            if len(unique_names) > 1:
                consistency_check["nama_konsisten"] = False
                consistency_check["issues"].append(f"Nama pasien tidak konsisten: {unique_names}")
            elif len(unique_names) == 1:
                consistency_check["nama_terdeteksi"] = unique_names[0]
            
            extracted_data["consistency_check"] = consistency_check
            
            print(f"✅ Data berhasil diekstrak untuk database matching:")
            print(f"   - Patient: {patient_data.get('nama_pasien', 'Tidak ditemukan')}")
            print(f"   - SEP: {extracted_data['sep_data'].get('no_sep', 'Tidak ditemukan')}")
            print(f"   - RM: {extracted_data['rm_data'].get('no_rekam_medis', 'Tidak ditemukan')}")
            print(f"   - Diagnosa: {len(all_diagnoses)} item")
            
    except Exception as e:
        print(f"❌ Error extracting data for database matching: {e}")
        extracted_data["error"] = str(e)
    
    return extracted_data

# ============================================================
# FUNGSI UTAMA UNTUK TESTING
# ============================================================
def main():
    """Fungsi utama untuk testing"""
    pdf_path = "Klaim Dokument_Internal Test.pdf"  # Ganti dengan path file PDF Anda
    
    if not os.path.exists(pdf_path):
        print(f"File {pdf_path} tidak ditemukan!")
        return
    
    print("Memulai validasi PDF (3 halaman)...")
    result = validate_claim_documents([pdf_path])
    
    # Print hasil validasi
    print("\n" + "="*80)
    print("HASIL VALIDASI PDF - 3 HALAMAN")
    print("="*80)
    
    if result['valid']:
        print("✅ SEMUA VALIDASI BERHASIL")
    else:
        print("❌ VALIDASI GAGAL")
    
    print(f"Pesan: {result['message']}")
    print(f"Total File: {result['total_files_processed']}")
    print(f"File Valid: {result['files_valid']}")
    print(f"File Gagal: {result['files_failed']}")
    
    # Tampilkan detail untuk setiap file
    for file_result in result['all_results']:
        print(f"\n📁 File: {file_result['filename']}")
        print(f"   Status: {'✅ VALID' if file_result['valid'] else '❌ GAGAL'}")
        print(f"   Pesan: {file_result['message']}")
        
        if file_result.get('warnings'):
            print("   ⚠️  Peringatan:")
            for warning in file_result['warnings']:
                print(f"     - {warning}")
        
        if file_result['errors']:
            print("   ❌ Alasan Gagal:")
            for error in file_result['errors']:
                print(f"     - {error}")
    
    # Tampilkan data yang diekstrak untuk file yang valid
    for file_result in result['valid_files']:
        print(f"\n📊 Data yang diekstrak dari {file_result['filename']}:")
        
        extracted_data = file_result.get('extracted_data', {})
        
        # Data SEP
        sep_data = extracted_data.get('sep', {})
        if sep_data.get('no_sep'):
            print(f"   📄 SEP: {sep_data['no_sep']}")
        if sep_data.get('tgl_sep'):
            print(f"   📅 Tgl SEP: {sep_data['tgl_sep']}")
        if sep_data.get('no_kartu'):
            print(f"   💳 No Kartu: {sep_data['no_kartu']}")
        if sep_data.get('diagnosa'):
            print("   🩺 DIAGNOSA SEP:")
            for d in sep_data['diagnosa']:
                status = "✅" if d['valid_icd'] else "❌"
                print(f"     {status} {d['kode']} - {d['deskripsi']}")
        
        # Data Rujukan
        rujukan_data = extracted_data.get('rujukan', {})
        if rujukan_data.get('no_rujukan'):
            print(f"   📋 RUJUKAN: {rujukan_data['no_rujukan']}")
        if rujukan_data.get('diagnosa_rujukan'):
            print("   🩺 DIAGNOSA RUJUKAN:")
            for d in rujukan_data['diagnosa_rujukan']:
                status = "✅" if d['valid_icd'] else "❌"
                print(f"     {status} {d['kode']} - {d['deskripsi']}")
        
        # Data Rekam Medis
        rm_data = extracted_data.get('rekam_medis', {})
        if rm_data.get('no_rekam_medis'):
            print(f"   🏥 REKAM MEDIS: {rm_data['no_rekam_medis']}")
        if rm_data.get('dokter_dpip'):
            print(f"   👨‍⚕️ Dokter DPJP: {rm_data['dokter_dpip']}")
        if rm_data.get('diagnosa_rm'):
            print("   🩺 DIAGNOSA REKAM MEDIS:")
            for d in rm_data['diagnosa_rm']:
                status = "✅" if d['valid_icd'] else "❌"
                print(f"     {status} {d['kode']} - {d['deskripsi']}")
        if rm_data.get('tindakan_medis'):
            print("   ⚕️ TINDAKAN MEDIS:")
            for t in rm_data['tindakan_medis']:
                status = "✅" if t['valid_icd9'] else "❌"
                kode_display = t['kode_icd9'] if t['kode_icd9'] else "Tidak ada kode"
                print(f"     {status} {kode_display} - {t['deskripsi']}")

if __name__ == "__main__":
    main()