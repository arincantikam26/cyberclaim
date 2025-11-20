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

# === SET TESSERACT PATH ===
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# ============================================================
# FUNGSI LOAD DATABASE ICD-10
# ============================================================
def load_icd10_database(csv_path="Code_ICD_10.csv"):
    """Load database ICD-10 dari file CSV"""
    icd_database = {}
    
    try:
        # Coba baca dengan pandas
        df = pd.read_csv(csv_path, delimiter=';', encoding='utf-8')
        print(f"[INFO] Loaded {len(df)} kode ICD-10 dari CSV")
        
        for _, row in df.iterrows():
            code = row['CODE'].strip()
            short_desc = row['SHORT DESCRIPTION (VALID ICD-10 FY2025)'].strip()
            long_desc = row['LONG DESCRIPTION (VALID ICD-10 FY2025)'].strip()
            
            icd_database[code] = {
                'short_description': short_desc,
                'long_description': long_desc
            }
            
    except Exception as e:
        print(f"[WARNING] Gagal load dengan pandas: {e}")
        print("[INFO] Mencoba load dengan csv module...")
        
        # Fallback dengan csv module
        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file, delimiter=';')
                headers = next(reader)  # Skip header
                
                for row in reader:
                    if len(row) >= 3:
                        code = row[0].strip()
                        short_desc = row[1].strip()
                        long_desc = row[2].strip()
                        
                        icd_database[code] = {
                            'short_description': short_desc,
                            'long_description': long_desc
                        }
                
                print(f"[INFO] Loaded {len(icd_database)} kode ICD-10 dari CSV")
                
        except Exception as e2:
            print(f"[ERROR] Gagal load database ICD-10: {e2}")
    
    return icd_database

# Global variable untuk database ICD-10
ICD10_DB = load_icd10_database()

# ============================================================
# FUNGSI UNTUK MENGATASI MASALAH DATABASE ICD-10
# ============================================================
def add_missing_icd_codes():
    """Tambahkan kode ICD-10 yang umum tapi mungkin tidak ada di database"""
    common_codes = {
        'N18.5': {
            'short_description': 'Chronic kidney disease, stage 5',
            'long_description': 'Chronic kidney disease, stage 5 (end-stage renal disease)'
        },
        'N18.9': {
            'short_description': 'Chronic kidney disease, unspecified',
            'long_description': 'Chronic kidney disease, unspecified'
        },
        'I10': {
            'short_description': 'Essential (primary) hypertension',
            'long_description': 'Essential (primary) hypertension'
        },
        'E11.9': {
            'short_description': 'Type 2 diabetes mellitus without complications',
            'long_description': 'Type 2 diabetes mellitus without complications'
        }
    }
    
    for code, desc in common_codes.items():
        if code not in ICD10_DB:
            ICD10_DB[code] = desc
            print(f"[INFO] Added missing ICD-10 code: {code}")

# Panggil fungsi untuk menambahkan kode yang umum
add_missing_icd_codes()

# ============================================================
# FUNGSI OCR
# ============================================================
def pdf_has_text(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        text = page.get_text().strip()
        if len(text) > 20:
            return True
    return False

def extract_digital_text(pdf_path):
    print("[INFO] Ekstrak teks digital dari PDF...")
    doc = fitz.open(pdf_path)
    result = []
    for i, page in enumerate(doc):
        text = page.get_text()
        result.append(f"\n=== HALAMAN {i+1} ===\n{text}")
    return "\n".join(result)

def ocr_image(image_path):
    print("[INFO] OCR gambar dengan Tesseract...")
    img = Image.open(image_path)
    return pytesseract.image_to_string(img, lang='ind+eng')

def render_pdf_with_fitz(pdf_path, dpi=300):
    print("[INFO] Render PDF → gambar (PyMuPDF fallback)...")
    doc = fitz.open(pdf_path)
    images = []
    for i in range(len(doc)):
        page = doc.load_page(i)
        zoom = dpi / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        img_path = f"temp_page_{i+1}.png"
        pix.save(img_path)
        images.append(img_path)
    return images

def ocr_pdf(pdf_path):
    print("[INFO] OCR PDF scan dengan Tesseract...")
    try:
        images = convert_from_path(pdf_path, dpi=300)
        print("[INFO] Render menggunakan pdf2image berhasil.")
        temp_imgs = []
        for i, img in enumerate(images):
            name = f"temp_page_{i+1}.png"
            img.save(name)
            temp_imgs.append(name)
    except:
        print("[WARN] pdf2image gagal → fallback PyMuPDF.")
        temp_imgs = render_pdf_with_fitz(pdf_path)
    
    output = []
    for i, img_path in enumerate(temp_imgs):
        print(f"[INFO] OCR halaman {i+1}...")
        text = pytesseract.image_to_string(Image.open(img_path), lang='ind+eng')
        output.append(f"\n=== HALAMAN {i+1} ===\n{text}")
        os.remove(img_path)
    return "\n".join(output)

def read_auto(path):
    ext = path.lower().split(".")[-1]
    if ext in ["png", "jpg", "jpeg", "bmp", "tiff"]:
        return ocr_image(path)
    if ext == "pdf":
        print("[INFO] Menganalisis PDF...")
        if pdf_has_text(path):
            print("[INFO] Terdeteksi TEKS DIGITAL → tidak pakai OCR.")
            return extract_digital_text(path)
        else:
            print("[INFO] PDF adalah SCAN/GAMBAR → gunakan OCR.")
            return ocr_pdf(path)
    raise Exception("Format file tidak didukung.")

# ============================================================
# FUNGSI VALIDASI ICD-10 YANG DIPERBAIKI
# ============================================================
def validate_icd10_code(code, icd_database):
    """Validasi kode ICD-10 terhadap database - Diperbarui"""
    if not code:
        return False, "Kode ICD-10 kosong"
    
    code = code.upper().strip()
    
    # Normalisasi kode (pastikan format konsisten)
    if '.' not in code and len(code) >= 3:
        # Format: N185 -> N18.5
        code = code[:3] + '.' + code[3:]
    
    # Validasi format dasar
    format_pattern = r'^[A-Z][0-9]{2}(\.[0-9]{1,2})?$'
    if not re.match(format_pattern, code):
        return False, "Format kode ICD-10 tidak valid"
    
    # Cek apakah kode ada dalam database
    if code in icd_database:
        return True, f"Valid - {icd_database[code]['short_description']}"
    else:
        # Fallback: coba tanpa titik
        code_no_dot = code.replace('.', '')
        if code_no_dot in icd_database:
            return True, f"Valid - {icd_database[code_no_dot]['short_description']}"
        else:
            return False, "Kode ICD-10 tidak ditemukan dalam database"

# ============================================================
# FUNGSI EKSTRAKSI DATA DARI PDF YANG DIPERBAIKI
# ============================================================
def extract_sep_info(text):
    """Ekstrak informasi penting dari teks SEP (Halaman 1) - Diperbarui"""
    info = {
        'no_sep': None,
        'nama_pasien': None,
        'tgl_sep': None,
        'no_kartu': None,
        'diagnosa': [],
        'field_wajib': [],
        'field_missing': []
    }
    
    # Field wajib untuk SEP
    field_wajib_sep = ['no_sep', 'nama_pasien', 'tgl_sep', 'no_kartu', 'diagnosa']
    
    # Pattern untuk mencari nomor SEP - lebih fleksibel
    sep_patterns = [
        r'No\.?SEP\s*:\s*([A-Z0-9]+)',
        r'SEP\s*:\s*([A-Z0-9]+)',
        r'Nomor\s*SEP\s*:\s*([A-Z0-9]+)',
        r'No\.SEP\s*:\s*(\d+V\d+)',  # Pattern khusus untuk format seperti 0123266V23461
        r'No\.SEP\s*:\s*([^\n]+)'   # Pattern umum
    ]
    
    for pattern in sep_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['no_sep'] = match.group(1).strip()
            break
    
    # Pattern untuk nama pasien - lebih fleksibel
    nama_patterns = [
        r'Nama\s*Peserta\s*:\s*([^\n]+)',
        r'Nama\s*:\s*([^\n]+)',
        r'Pasien\s*:\s*([^\n]+)',
        r'Nama\s*Peserta\s*([^\n]+)'
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            # Bersihkan teks nama
            nama = match.group(1).strip()
            # Hapus karakter yang tidak diinginkan
            nama = re.sub(r'[^A-Za-z\s]', '', nama).strip()
            info['nama_pasien'] = nama
            break
    
    # Pattern untuk tanggal SEP
    tgl_patterns = [
        r'Tgl\.?SEP\s*:\s*(\d{4}-\d{2}-\d{2})',
        r'Tanggal\s*SEP\s*:\s*(\d{4}-\d{2}-\d{2})',
        r'Tgl\.?SEP\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})',
        r'Tanggal\s*SEP\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})'
    ]
    
    for pattern in tgl_patterns:
        match = re.search(pattern, text)
        if match:
            info['tgl_sep'] = match.group(1)
            break
    
    # Pattern untuk nomor kartu
    kartu_patterns = [
        r'No\.?Kartu\s*:\s*([0-9]+)',
        r'Kartu\s*:\s*([0-9]+)',
        r'BPJS\s*:\s*([0-9]+)',
        r'No\.?Kartu\s*([0-9]+)'
    ]
    
    for pattern in kartu_patterns:
        match = re.search(pattern, text)
        if match:
            info['no_kartu'] = match.group(1)
            break
    
    # Pattern untuk diagnosa (ICD-10) - LEBIH FLEKSIBEL
    diagnosa_patterns = [
        r'Diagnosa\s*Awal\s*:\s*([A-Z][0-9]{2}\.[0-9]+)\s*[-–]\s*([^\n]+)',
        r'Diagnosa\s*Awal\s*:\s*([A-Z][0-9]{2}\.[0-9]+)\s*[-]?\s*([^\n]+)',
        r'Diagnosa\s*:\s*([A-Z][0-9]{2}\.[0-9]+)\s*[-–]?\s*([^\n]+)',
        r'([A-Z][0-9]{2}\.[0-9]+)\s*[-–]\s*([^\n]+)',
        r'Diagnosa\s*Awal\s*:\s*-\s*([A-Z][0-9]{2}\.[0-9]+)\s*-\s*([^\n]+)'
    ]
    
    for pattern in diagnosa_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            if len(match) == 2:
                kode = match[0].strip()
                deskripsi = match[1].strip()
                
                # Validasi kode ICD-10
                is_valid, validation_msg = validate_icd10_code(kode, ICD10_DB)
                
                info['diagnosa'].append({
                    'kode': kode,
                    'deskripsi': deskripsi,
                    'valid_icd10': is_valid,
                    'validation_msg': validation_msg
                })
                break  # Hanya ambil diagnosa pertama
    
    # Fallback: cari kode ICD-10 saja jika pattern di atas gagal
    if not info['diagnosa']:
        icd_pattern = r'([A-Z][0-9]{2}\.[0-9]+)'
        icd_matches = re.findall(icd_pattern, text)
        for code in icd_matches:
            is_valid, validation_msg = validate_icd10_code(code, ICD10_DB)
            info['diagnosa'].append({
                'kode': code,
                'deskripsi': 'Deskripsi tidak ditemukan',
                'valid_icd10': is_valid,
                'validation_msg': validation_msg
            })
            break  # Hanya ambil kode pertama
    
    # Cek field wajib yang ditemukan dan yang missing
    for field in field_wajib_sep:
        if info[field]:
            if field == 'diagnosa' and info[field]:  # Diagnosa tidak boleh kosong
                info['field_wajib'].append(field)
            elif info[field]:  # Field lainnya
                info['field_wajib'].append(field)
        else:
            info['field_missing'].append(field)
    
    return info

def extract_rujukan_info(text):
    """Ekstrak informasi dari surat rujukan (Halaman 2) - Diperbarui"""
    info = {
        'diagnosa_rujukan': [],
        'nama_pasien_rujukan': None,
        'no_rujukan': None,
        'dokter_perujuk': None,
        'field_wajib': [],
        'field_missing': []
    }
    
    # Field wajib untuk rujukan
    field_wajib_rujukan = ['no_rujukan', 'nama_pasien_rujukan', 'diagnosa_rujukan']
    
    # Pattern untuk nomor rujukan - lebih fleksibel
    rujukan_patterns = [
        r'No\.?\s*Rujukan\s*:\s*([^\n]+)',
        r'Rujukan\s*:\s*([^\n]+)',
        r'Nomor\s*Rujukan\s*:\s*([^\n]+)',
        r'No\s*Rujukan[:\s]*([^\n]+)'
    ]
    
    for pattern in rujukan_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['no_rujukan'] = match.group(1).strip()
            break
    
    # Pattern untuk nama pasien di rujukan
    nama_patterns = [
        r'Nama\s*:\s*([^\n]+)',
        r'Nama\s*Pasien\s*:\s*([^\n]+)',
        r'Pasien\s*:\s*([^\n]+)',
        r'penderita\s*:\s*([^\n]+)'
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            info['nama_pasien_rujukan'] = match.group(1).strip()
            break
    
    # Pattern untuk diagnosa rujukan - LEBIH FLEKSIBEL
    diagnosa_patterns = [
        r'Diagnosa\s*:\s*([^\n]+)',
        r'Diagnosa\s*Awal\s*:\s*([^\n]+)',
        r'Keluhan\s*:\s*([^\n]+)',
        r'Mohon pemeriksaan[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*Diagnosa\s*:\s*([^\n]+)'
    ]
    
    for pattern in diagnosa_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            diagnosa_text = match.group(1).strip()
            
            # Cari kode ICD-10 dalam diagnosa
            icd_pattern = r'([A-Z][0-9]{2}\.?[0-9]*)'
            icd_matches = re.findall(icd_pattern, diagnosa_text)
            
            for code in icd_matches:
                # Validasi kode ICD-10
                is_valid, validation_msg = validate_icd10_code(code, ICD10_DB)
                info['diagnosa_rujukan'].append({
                    'kode': code,
                    'deskripsi': diagnosa_text,
                    'valid_icd10': is_valid,
                    'validation_msg': validation_msg
                })
            
            # Jika tidak ada kode ICD-10, tetap simpan diagnosa teks
            if not icd_matches and diagnosa_text:
                info['diagnosa_rujukan'].append({
                    'kode': None,
                    'deskripsi': diagnosa_text,
                    'valid_icd10': False,
                    'validation_msg': 'Tidak ada kode ICD-10 yang ditemukan'
                })
            break
    
    # Pattern untuk dokter perujuk - LEBIH FLEKSIBEL
    dokter_patterns = [
        r'dr\.\s*([A-Za-z\s\.]+)',
        r'Dokter\s*:\s*([A-Za-z\s\.]+)',
        r'Perujuk\s*:\s*([A-Za-z\s\.]+)',
        r'[Dd]r\.\s*([^\n,]+)'
    ]
    
    for pattern in dokter_patterns:
        match = re.search(pattern, text)
        if match:
            info['dokter_perujuk'] = match.group(0).strip()
            break
    
    # Cek field wajib yang ditemukan dan yang missing
    for field in field_wajib_rujukan:
        if info[field]:
            if field == 'diagnosa_rujukan' and info[field]:  # Diagnosa tidak boleh kosong
                info['field_wajib'].append(field)
            elif info[field]:  # Field lainnya
                info['field_wajib'].append(field)
        else:
            info['field_missing'].append(field)
    
    return info

def extract_rekam_medis_info(text_halaman_3: str, text_halaman_4: str = "") -> Dict[str, Any]:
    """Ekstrak informasi dari rekam medis (Halaman 3) dan lanjutan (Halaman 4) - Diperbarui"""
    # Gabungkan teks dari halaman 3 dan 4 untuk analisis yang lebih komprehensif
    combined_text = text_halaman_3 + "\n" + text_halaman_4
    
    info = {
        'diagnosa_rm': [],
        'nama_pasien_rm': None,
        'no_rekam_medis': None,
        'dokter_dpip': None,
        'tanda_tangan_dpip': False,
        'field_wajib': [],
        'field_missing': [],
        'data_lanjutan': {}  # Data tambahan dari halaman 4
    }
    
    # Field wajib untuk rekam medis
    field_wajib_rm = ['no_rekam_medis', 'nama_pasien_rm', 'diagnosa_rm', 'dokter_dpip']
    
    # Pattern untuk nomor rekam medis (biasanya di halaman 3)
    rm_patterns = [
        r'No\.?\s*Rekam\s*Medik?\s*:\s*([A-Z0-9\-]+)',
        r'Rekam\s*Medis\s*:\s*([A-Z0-9\-]+)',
        r'No\.?RM\s*:\s*([A-Z0-9\-]+)',
        r'No\.\s*Rekam\s*Medik\s*:\s*([^\n]+)'
    ]
    
    for pattern in rm_patterns:
        match = re.search(pattern, text_halaman_3, re.IGNORECASE)
        if match:
            info['no_rekam_medis'] = match.group(1).strip()
            break
    
    # Pattern untuk nama pasien di rekam medis (halaman 3)
    nama_patterns = [
        r'Nama\s*Pasien\s*:\s*([^\n]+)',
        r'Nama\s*:\s*([^\n]+)',
        r'Pasien\s*:\s*([^\n]+)',
        r'Nama\s*Pasien[^\n]*\n[^\n]*\n[^\n]*\n([A-Z]+)'
    ]
    
    for pattern in nama_patterns:
        match = re.search(pattern, text_halaman_3, re.IGNORECASE)
        if match:
            info['nama_pasien_rm'] = match.group(1).strip()
            break
    
    # Pattern untuk diagnosa rekam medis (bisa di halaman 3 atau 4) - LEBIH FLEKSIBEL
    diagnosa_patterns = [
        r'Diagnosa\s*masuk\s*:\s*([^\n]+)',
        r'Diagnosa\s*Utama\s*:\s*([^\n]+)',
        r'Diagnosa\s*:\s*([^\n]+)',
        r'ICD\s*X\s*([A-Z][0-9]{2}\.[0-9]+)',
        r'Diagnosa\s*masuk[^\n]*\n[^\n]*\n([^\n]+)'
    ]
    
    # Cari diagnosa di kedua halaman
    for text_source in [text_halaman_3, text_halaman_4]:
        for pattern in diagnosa_patterns:
            matches = re.findall(pattern, text_source, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    diagnosa_text = match.strip()
                    
                    # Cari kode ICD-10 dalam diagnosa
                    icd_pattern = r'([A-Z][0-9]{2}\.?[0-9]*)'
                    icd_matches = re.findall(icd_pattern, diagnosa_text)
                    
                    for code in icd_matches:
                        # Validasi kode ICD-10
                        is_valid, validation_msg = validate_icd10_code(code, ICD10_DB)
                        info['diagnosa_rm'].append({
                            'kode': code,
                            'deskripsi': diagnosa_text,
                            'valid_icd10': is_valid,
                            'validation_msg': validation_msg,
                            'source': 'halaman_3' if text_source == text_halaman_3 else 'halaman_4'
                        })
                    
                    # Jika tidak ada kode ICD-10, tetap simpan diagnosa teks
                    if not icd_matches and diagnosa_text:
                        info['diagnosa_rm'].append({
                            'kode': None,
                            'deskripsi': diagnosa_text,
                            'valid_icd10': False,
                            'validation_msg': 'Tidak ada kode ICD-10 yang ditemukan',
                            'source': 'halaman_3' if text_source == text_halaman_3 else 'halaman_4'
                        })
    
    # Pattern untuk dokter DPJP (biasanya di halaman 3 atau 4) - LEBIH FLEKSIBEL
    dokter_patterns = [
        r'Dokter\s*yang\s*merawat\s*:\s*([^\n]+)',
        r'Dokter\s*:\s*([^\n]+)',
        r'dr\.\s*([A-Za-z\s\.]+)',
        r'Dokter[^\n]*merawat[^\n]*\n[^\n]*\n([^\n]+)',
        r'DR\.\s*([A-Z\s\.]+)'
    ]
    
    for pattern in dokter_patterns:
        # Cari di kedua halaman
        for text_source in [text_halaman_3, text_halaman_4]:
            match = re.search(pattern, text_source, re.IGNORECASE)
            if match:
                info['dokter_dpip'] = match.group(1).strip() if match.lastindex else match.group(0).strip()
                break
        if info['dokter_dpip']:
            break
    
    # Cek tanda tangan DPJP (biasanya di halaman 4 - bagian akhir)
    tanda_tangan_patterns = [
        r'Tanda\s*tangan',
        r'Signature',
        r'Paraf',
        r'Dokter\s*yang\s*merawat\s*$',
        r'Tanda\s*tangan\s*:'
    ]
    
    # Prioritaskan pencarian di halaman 4 untuk tanda tangan
    for pattern in tanda_tangan_patterns:
        if re.search(pattern, text_halaman_4, re.IGNORECASE):
            info['tanda_tangan_dpip'] = True
            break
    # Jika tidak ditemukan di halaman 4, cari di halaman 3
    if not info['tanda_tangan_dpip']:
        for pattern in tanda_tangan_patterns:
            if re.search(pattern, text_halaman_3, re.IGNORECASE):
                info['tanda_tangan_dpip'] = True
                break
    
    # Ekstrak data tambahan dari halaman 4 (lanjutan rekam medis)
    info['data_lanjutan'] = extract_lanjutan_rekam_medis(text_halaman_4)
    
    # Cek field wajib yang ditemukan dan yang missing
    for field in field_wajib_rm:
        if info[field]:
            if field == 'diagnosa_rm' and info[field]:  # Diagnosa tidak boleh kosong
                info['field_wajib'].append(field)
            elif info[field]:  # Field lainnya
                info['field_wajib'].append(field)
        else:
            info['field_missing'].append(field)
    
    return info

def extract_lanjutan_rekam_medis(text_halaman_4: str) -> Dict[str, Any]:
    """Ekstrak informasi tambahan dari halaman 4 (lanjutan rekam medis)"""
    data = {
        'tindakan_medis': [],
        'pengobatan': [],
        'komplikasi': [],
        'hasil_lab': [],
        'status_keluar': None
    }
    
    # Pattern untuk tindakan medis
    tindakan_patterns = [
        r'Operasi\s*/\s*Tindakan\s*:\s*([^\n]+)',
        r'Tindakan\s*:\s*([^\n]+)',
        r'Prosedur\s*:\s*([^\n]+)'
    ]
    
    for pattern in tindakan_patterns:
        match = re.search(pattern, text_halaman_4, re.IGNORECASE)
        if match:
            data['tindakan_medis'].append(match.group(1).strip())
    
    # Pattern untuk pengobatan
    pengobatan_patterns = [
        r'Pengobatan\s*:\s*([^\n]+)',
        r'Terapi\s*:\s*([^\n]+)',
        r'Medikasi\s*:\s*([^\n]+)'
    ]
    
    for pattern in pengobatan_patterns:
        match = re.search(pattern, text_halaman_4, re.IGNORECASE)
        if match:
            data['pengobatan'].append(match.group(1).strip())
    
    # Pattern untuk komplikasi
    komplikasi_patterns = [
        r'Komplikasi\s*:\s*([^\n]+)',
        r'Komplikasi\s*[1-9]\s*:\s*([^\n]+)'
    ]
    
    for pattern in komplikasi_patterns:
        match = re.search(pattern, text_halaman_4, re.IGNORECASE)
        if match:
            data['komplikasi'].append(match.group(1).strip())
    
    # Pattern untuk status keluar
    status_patterns = [
        r'Keadaan\s*KRS\s*:\s*([^\n]+)',
        r'Status\s*Keluar\s*:\s*([^\n]+)',
        r'Cara\s*KRS\s*:\s*([^\n]+)'
    ]
    
    for pattern in status_patterns:
        match = re.search(pattern, text_halaman_4, re.IGNORECASE)
        if match:
            data['status_keluar'] = match.group(1).strip()
            break
    
    return data

# ============================================================
# FUNGSI UNTUK PRINT DATA YANG TERBACA
# ============================================================
def print_extracted_data(validation_result: Dict[str, Any]):
    """Print data yang berhasil diekstrak dari PDF"""
    print("\n" + "="*80)
    print("DATA YANG BERHASIL DIEKSTRAK DARI PDF")
    print("="*80)
    
    if not validation_result.get("extracted_data"):
        print("Tidak ada data yang berhasil diekstrak")
        return
    
    data = validation_result["extracted_data"]
    
    # Print data SEP
    print("\n1. DATA SEP (Halaman 1):")
    print("-" * 40)
    sep_data = data.get('sep', {})
    print(f"   No. SEP      : {sep_data.get('no_sep', 'Tidak ditemukan')}")
    print(f"   Nama Pasien  : {sep_data.get('nama_pasien', 'Tidak ditemukan')}")
    print(f"   Tgl. SEP     : {sep_data.get('tgl_sep', 'Tidak ditemukan')}")
    print(f"   No. Kartu    : {sep_data.get('no_kartu', 'Tidak ditemukan')}")
    
    diagnosa_sep = sep_data.get('diagnosa', [])
    if diagnosa_sep:
        print("   Diagnosa     :")
        for d in diagnosa_sep:
            status = "VALID" if d.get('valid_icd10') else "INVALID"
            print(f"     - {d.get('kode')}: {d.get('deskripsi')} ({status})")
            print(f"       Pesan validasi: {d.get('validation_msg')}")
    else:
        print("   Diagnosa     : Tidak ditemukan")
    
    print(f"   Field Wajib  : {', '.join(sep_data.get('field_wajib', []))}")
    print(f"   Field Missing: {', '.join(sep_data.get('field_missing', []))}")
    
    # Print data Rujukan
    print("\n2. DATA SURAT RUJUKAN (Halaman 2):")
    print("-" * 40)
    rujukan_data = data.get('rujukan', {})
    print(f"   No. Rujukan  : {rujukan_data.get('no_rujukan', 'Tidak ditemukan')}")
    print(f"   Nama Pasien  : {rujukan_data.get('nama_pasien_rujukan', 'Tidak ditemukan')}")
    print(f"   Dokter Perujuk: {rujukan_data.get('dokter_perujuk', 'Tidak ditemukan')}")
    
    diagnosa_rujukan = rujukan_data.get('diagnosa_rujukan', [])
    if diagnosa_rujukan:
        print("   Diagnosa     :")
        for d in diagnosa_rujukan:
            status = "VALID" if d.get('valid_icd10') else "INVALID"
            print(f"     - {d.get('kode')}: {d.get('deskripsi')} ({status})")
            print(f"       Pesan validasi: {d.get('validation_msg')}")
    else:
        print("   Diagnosa     : Tidak ditemukan")
    
    print(f"   Field Wajib  : {', '.join(rujukan_data.get('field_wajib', []))}")
    print(f"   Field Missing: {', '.join(rujukan_data.get('field_missing', []))}")
    
    # Print data Rekam Medis
    print("\n3. DATA REKAM MEDIS (Halaman 3):")
    print("-" * 40)
    rm_data = data.get('rekam_medis', {})
    print(f"   No. RM       : {rm_data.get('no_rekam_medis', 'Tidak ditemukan')}")
    print(f"   Nama Pasien  : {rm_data.get('nama_pasien_rm', 'Tidak ditemukan')}")
    print(f"   Dokter DPJP  : {rm_data.get('dokter_dpip', 'Tidak ditemukan')}")
    print(f"   Tanda Tangan : {'DITEMUKAN' if rm_data.get('tanda_tangan_dpip') else 'TIDAK DITEMUKAN'}")
    
    diagnosa_rm = rm_data.get('diagnosa_rm', [])
    if diagnosa_rm:
        print("   Diagnosa     :")
        for d in diagnosa_rm:
            status = "VALID" if d.get('valid_icd10') else "INVALID"
            source = d.get('source', 'unknown')
            print(f"     - {d.get('kode')}: {d.get('deskripsi')} ({status}) - {source}")
            print(f"       Pesan validasi: {d.get('validation_msg')}")
    else:
        print("   Diagnosa     : Tidak ditemukan")
    
    # Print data lanjutan dari halaman 4
    data_lanjutan = rm_data.get('data_lanjutan', {})
    if data_lanjutan:
        print("   Data Lanjutan:")
        if data_lanjutan.get('tindakan_medis'):
            print(f"     - Tindakan Medis: {', '.join(data_lanjutan['tindakan_medis'])}")
        if data_lanjutan.get('pengobatan'):
            print(f"     - Pengobatan: {', '.join(data_lanjutan['pengobatan'])}")
        if data_lanjutan.get('komplikasi'):
            print(f"     - Komplikasi: {', '.join(data_lanjutan['komplikasi'])}")
        if data_lanjutan.get('status_keluar'):
            print(f"     - Status Keluar: {data_lanjutan['status_keluar']}")
    
    print(f"   Field Wajib  : {', '.join(rm_data.get('field_wajib', []))}")
    print(f"   Field Missing: {', '.join(rm_data.get('field_missing', []))}")
    
    # Print hasil validasi
    print("\n4. HASIL VALIDASI:")
    print("-" * 40)
    validation_details = validation_result.get("validation_details", {})
    
    # Validasi field
    field_validation = validation_details.get('field_validation', {})
    print("   Validasi Field:")
    for doc_type, validation in field_validation.items():
        status = validation.get('status', 'UNKNOWN')
        missing = validation.get('missing_fields', [])
        print(f"     - {doc_type.upper()}: {status} {f'(Missing: {missing})' if missing else ''}")
    
    # Validasi diagnosa
    diagnosa_validation = validation_details.get('diagnosa_validation', {})
    print(f"   Validasi Diagnosa: {diagnosa_validation.get('status', 'UNKNOWN')}")
    if diagnosa_validation.get('matching_codes'):
        print(f"     - Kode yang match: {', '.join(diagnosa_validation['matching_codes'])}")
    if diagnosa_validation.get('sep_codes'):
        print(f"     - Kode SEP: {', '.join(diagnosa_validation['sep_codes'])}")
    if diagnosa_validation.get('rm_codes'):
        print(f"     - Kode RM: {', '.join(diagnosa_validation['rm_codes'])}")
    
    # Validasi tanda tangan
    signature_validation = validation_details.get('signature_validation', {})
    print(f"   Validasi Tanda Tangan: {signature_validation.get('status', 'UNKNOWN')}")
    
    # Print error jika ada
    errors = validation_result.get("errors", [])
    if errors:
        print("\n5. ERROR YANG DITEMUKAN:")
        print("-" * 40)
        for i, error in enumerate(errors, 1):
            print(f"   {i}. {error}")
    
    print("\n" + "="*80)
    print(f"STATUS VALIDASI: {'BERHASIL' if validation_result.get('valid') else 'GAGAL'}")
    print(f"PESAN: {validation_result.get('message', 'Tidak ada pesan')}")
    print("="*80)

# ============================================================
# FUNGSI VALIDASI UTAMA YANG DIPERBAIKI
# ============================================================
def validate_pdf_content_detailed(pdf_path: str) -> Dict[str, Any]:
    """
    Validasi konten PDF secara detail dengan ekstraksi data lengkap
    Struktur: H1=SEP, H2=Rujukan, H3=Rekam Medis, H4=Lanjutan Rekam Medis
    
    PERUBAHAN PENTING: Validasi tidak menghalangi data masuk ke claim
    """
    try:
        # Baca teks dari PDF
        full_text = read_auto(pdf_path)
        
        # Pisahkan teks berdasarkan halaman
        pages = full_text.split("=== HALAMAN")
        
        # Ekstrak teks per halaman sesuai struktur baru
        sep_text = ""
        rujukan_text = ""
        rekam_medis_text = ""
        lanjutan_rm_text = ""
        
        for i, page in enumerate(pages):
            if "1" in page[:5]:  # Halaman 1 - SEP
                sep_text = page
            elif "2" in page[:5]:  # Halaman 2 - Surat Rujukan
                rujukan_text = page
            elif "3" in page[:5]:  # Halaman 3 - Rekam Medis
                rekam_medis_text = page
            elif "4" in page[:5]:  # Halaman 4 - Lanjutan Rekam Medis
                lanjutan_rm_text = page
        
        # Jika tidak bisa dipisah, gunakan teks lengkap untuk halaman yang sesuai
        if not sep_text:
            sep_text = full_text
        if not rujukan_text:
            rujukan_text = full_text
        if not rekam_medis_text:
            rekam_medis_text = full_text
        if not lanjutan_rm_text:
            lanjutan_rm_text = full_text
        
        # Ekstrak informasi dari keempat dokumen
        sep_info = extract_sep_info(sep_text)
        rujukan_info = extract_rujukan_info(rujukan_text)
        rm_info = extract_rekam_medis_info(rekam_medis_text, lanjutan_rm_text)
        
        # Validasi field wajib - TIDAK LAGI MENGHALANGI
        errors = []
        warnings = []  # Tambahkan warnings untuk data yang kurang optimal
        validation_details = {
            'sep': sep_info,
            'rujukan': rujukan_info,
            'rekam_medis': rm_info,
            'field_validation': {},
            'diagnosa_validation': {},
            'signature_validation': {},
            'data_lanjutan': rm_info.get('data_lanjutan', {})
        }
        
        # 1. Validasi field wajib - SEKARANG HANYA WARNING
        if sep_info['field_missing']:
            warnings.append(f"SEP field wajib kosong: {', '.join(sep_info['field_missing'])}")
            validation_details['field_validation']['sep'] = {
                'status': 'INCOMPLETE',
                'missing_fields': sep_info['field_missing']
            }
        else:
            validation_details['field_validation']['sep'] = {
                'status': 'COMPLETE',
                'missing_fields': []
            }
        
        if rujukan_info['field_missing']:
            warnings.append(f"Rujukan field wajib kosong: {', '.join(rujukan_info['field_missing'])}")
            validation_details['field_validation']['rujukan'] = {
                'status': 'INCOMPLETE',
                'missing_fields': rujukan_info['field_missing']
            }
        else:
            validation_details['field_validation']['rujukan'] = {
                'status': 'COMPLETE',
                'missing_fields': []
            }
        
        if rm_info['field_missing']:
            warnings.append(f"Rekam Medis field wajib kosong: {', '.join(rm_info['field_missing'])}")
            validation_details['field_validation']['rekam_medis'] = {
                'status': 'INCOMPLETE',
                'missing_fields': rm_info['field_missing']
            }
        else:
            validation_details['field_validation']['rekam_medis'] = {
                'status': 'COMPLETE',
                'missing_fields': []
            }
        
        # 2. Compare field diagnosa antara SEP dan Rekam Medis - HANYA WARNING
        sep_diagnosa_codes = [d['kode'] for d in sep_info['diagnosa'] if d['valid_icd10']]
        rm_diagnosa_codes = [d['kode'] for d in rm_info['diagnosa_rm'] if d['valid_icd10']]
        
        if sep_diagnosa_codes and rm_diagnosa_codes:
            matches = set(sep_diagnosa_codes) & set(rm_diagnosa_codes)
            if matches:
                validation_details['diagnosa_validation']['status'] = 'MATCH'
                validation_details['diagnosa_validation']['matching_codes'] = list(matches)
            else:
                validation_details['diagnosa_validation']['status'] = 'NO_MATCH'
                validation_details['diagnosa_validation']['sep_codes'] = sep_diagnosa_codes
                validation_details['diagnosa_validation']['rm_codes'] = rm_diagnosa_codes
                warnings.append("Diagnosa antara SEP dan Rekam Medis tidak match")
        else:
            validation_details['diagnosa_validation']['status'] = 'INCOMPLETE_DATA'
        
        # 3. Cek tanda tangan DPJP di rekam medis - HANYA WARNING
        if rm_info['tanda_tangan_dpip']:
            validation_details['signature_validation']['status'] = 'FOUND'
        else:
            validation_details['signature_validation']['status'] = 'NOT_FOUND'
            warnings.append("Tanda tangan DPJP tidak ditemukan di rekam medis")
        
        # 4. Validasi ICD-10 untuk semua diagnosa - HANYA WARNING
        invalid_icd_sep = [d for d in sep_info['diagnosa'] if not d['valid_icd10']]
        invalid_icd_rm = [d for d in rm_info['diagnosa_rm'] if not d['valid_icd10']]
        invalid_icd_rujukan = [d for d in rujukan_info['diagnosa_rujukan'] if not d['valid_icd10']]
        
        all_invalid = invalid_icd_sep + invalid_icd_rm + invalid_icd_rujukan
        if all_invalid:
            for invalid in all_invalid:
                if invalid['kode']:
                    warnings.append(f"Kode ICD-10 tidak valid: {invalid['kode']} - {invalid['validation_msg']}")
        
        # Tentukan status validasi - SELALU RETURN DATA MESKIPUN ADA ERROR
        # Validasi sekarang hanya untuk informasi, tidak menghalangi proses claim
        has_critical_data = (
            sep_info.get('no_sep') and 
            sep_info.get('nama_pasien') and 
            sep_info.get('no_kartu')
        )
        
        result = {
            "valid": has_critical_data,  # Hanya butuh data kritis
            "message": "Data berhasil diekstrak" if has_critical_data else "Data tidak lengkap tapi tetap diproses",
            "errors": errors,
            "warnings": warnings,
            "extracted_data": {
                "sep": sep_info,
                "rujukan": rujukan_info,
                "rekam_medis": rm_info
            },
            "validation_details": validation_details,
            "missing_fields": {
                "sep": sep_info['field_missing'],
                "rujukan": rujukan_info['field_missing'],
                "rekam_medis": rm_info['field_missing']
            }
        }
        
        # Print data yang diekstrak
        print_extracted_data(result)
        
        return result
        
    except Exception as e:
        error_result = {
            "valid": False,
            "message": f"Error validasi konten: {str(e)}",
            "errors": [str(e)],
            "warnings": [],
            "extracted_data": {},
            "validation_details": {},
            "missing_fields": {}
        }
        print_extracted_data(error_result)
        return error_result

def validate_single_pdf_structure(pdf_path: str) -> Dict[str, Any]:
    """
    Validasi struktur single PDF file - harus memiliki 4 halaman yang diperlukan
    """
    try:
        import PyPDF2
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            page_count = len(pdf_reader.pages)
            
            if page_count < 4:
                return {
                    "valid": False,
                    "message": f"File harus memiliki minimal 4 halaman, ditemukan {page_count} halaman",
                    "page_count": page_count,
                    "pages_present": [],
                    "missing_pages": ["SEP", "SURAT_RUJUKAN", "REKAM_MEDIS", "REKAM_MEDIS_LANJUTAN"] if page_count < 4 else []
                }
            
            # Struktur baru: H1=SEP, H2=Rujukan, H3=Rekam Medis, H4=Lanjutan Rekam Medis
            pages_present = ["SEP", "SURAT_RUJUKAN", "REKAM_MEDIS", "REKAM_MEDIS_LANJUTAN"]
            
            # Validasi konten setiap halaman (basic validation)
            validation_results = validate_pdf_content_basic(pdf_reader)
            
            if not validation_results["all_pages_valid"]:
                return {
                    "valid": False,
                    "message": f"Konten halaman tidak sesuai: {validation_results['errors']}",
                    "page_count": page_count,
                    "pages_present": pages_present,
                    "missing_pages": validation_results["missing_pages"],
                    "content_errors": validation_results["errors"]
                }
            
            return {
                "valid": True,
                "message": "Struktur PDF valid",
                "page_count": page_count,
                "pages_present": pages_present,
                "missing_pages": []
            }
            
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error membaca file PDF: {str(e)}",
            "page_count": 0,
            "pages_present": [],
            "missing_pages": ["SEP", "SURAT_RUJUKAN", "REKAM_MEDIS", "REKAM_MEDIS_LANJUTAN"]
        }

def validate_pdf_content_basic(pdf_reader) -> Dict[str, Any]:
    """
    Validasi konten basic setiap halaman PDF sesuai struktur 4 halaman
    - Diperbarui berdasarkan konten aktual dari dokumen contoh
    """
    errors = []
    missing_pages = []
    
    try:
        # Halaman 1 - SEP
        if len(pdf_reader.pages) > 0:
            page1_text = pdf_reader.pages[0].extract_text().lower()
            sep_keywords = [
                "sep", "surat eligibilitas peserta", "no.sep", "tgl.sep", 
                "peserta", "diagnosa", "bpjs kesehatan", "badan penyelenggara jaminan sosial",
                "no.kartu", "nama peserta", "jns.rawat"
            ]
            sep_found = any(keyword in page1_text for keyword in sep_keywords)
            if not sep_found:
                errors.append("Halaman 1 tidak mengandung konten SEP yang valid")
                missing_pages.append("SEP")
        
        # Halaman 2 - Surat Rujukan  
        if len(pdf_reader.pages) > 1:
            page2_text = pdf_reader.pages[1].extract_text().lower()
            rujukan_keywords = [
                "rujukan", "surat rujukan peserta", "kepada yth", 
                "dokter perujuk", "puskesmas", "mohon pemeriksaan",
                "demikian atas bantuannya", "salam sejawat"
            ]
            rujukan_found = any(keyword in page2_text for keyword in rujukan_keywords)
            if not rujukan_found:
                errors.append("Halaman 2 tidak mengandung konten Surat Rujukan yang valid")
                missing_pages.append("SURAT_RUJUKAN")
        
        # Halaman 3 - Rekam Medis
        if len(pdf_reader.pages) > 2:
            page3_text = pdf_reader.pages[2].extract_text().lower()
            rm_keywords = [
                "rekam medis", "formulir rekam medis", "diagnosa masuk", 
                "riwayat alergi", "tanggal mrs", "nama pasien", "no. rekam medik",
                "kamar / kelas", "alamat", "status perkawinan"
            ]
            rm_found = any(keyword in page3_text for keyword in rm_keywords)
            if not rm_found:
                errors.append("Halaman 3 tidak mengandung konten Rekam Medis yang valid")
                missing_pages.append("REKAM_MEDIS")
        
        # Halaman 4 - Lanjutan Rekam Medis
        if len(pdf_reader.pages) > 3:
            page4_text = pdf_reader.pages[3].extract_text().lower()
            rm_lanjutan_keywords = [
                "diagnosa sekunder", "operasi / tindakan", "transfusi darah", 
                "keadaan krs", "cara krs", "icd x", "komplikasi",
                "dokter yang merawat", "tanda tangan", "infeksi nosokomial"
            ]
            rm_lanjutan_found = any(keyword in page4_text for keyword in rm_lanjutan_keywords)
            if not rm_lanjutan_found:
                # Untuk halaman 4, kita lebih flexible
                if not any(keyword in page4_text for keyword in ["rekam medis", "medical record", "diagnosa", "operasi"]):
                    errors.append("Halaman 4 mungkin tidak mengandung konten Lanjutan Rekam Medis yang valid")
        
        return {
            "all_pages_valid": len(errors) == 0,
            "errors": errors,
            "missing_pages": missing_pages
        }
        
    except Exception as e:
        return {
            "all_pages_valid": False,
            "errors": [f"Error validasi konten: {str(e)}"],
            "missing_pages": ["SEP", "SURAT_RUJUKAN", "REKAM_MEDIS", "REKAM_MEDIS_LANJUTAN"]
        }

def validate_claim_documents(extracted_files: List[str]) -> Dict[str, Any]:
    """
    Validasi dokumen-dokumen yang diperlukan dalam claim
    PERUBAHAN PENTING: Validasi tidak menghalangi data masuk ke claim
    """
    validation_errors = []
    validation_warnings = []
    valid_files = []
    
    # Filter hanya file PDF
    pdf_files = [f for f in extracted_files if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        return {
            "valid": False,
            "message": "Tidak ada file PDF yang ditemukan dalam archive",
            "file_errors": ["Archive harus mengandung minimal 1 file PDF dengan 4 halaman"]
        }
    
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        file_validation = validate_single_pdf_structure(pdf_file)
        
        if file_validation["valid"]:
            # Lakukan validasi konten yang lebih detail
            content_validation = validate_pdf_content_detailed(pdf_file)
            
            # SEKARANG: Data tetap diproses meskipun validasi gagal
            valid_files.append({
                "filename": filename,
                "file_path": pdf_file,
                "page_count": file_validation["page_count"],
                "pages_present": file_validation["pages_present"],
                "extracted_data": content_validation["extracted_data"],
                "validation_details": content_validation["validation_details"],
                "validation_status": content_validation["valid"],
                "warnings": content_validation.get("warnings", []),
                "errors": content_validation.get("errors", [])
            })
            
            # Tambahkan warning jika validasi konten gagal
            if not content_validation["valid"]:
                validation_warnings.append({
                    "filename": filename,
                    "warning": "Data memiliki masalah validasi tapi tetap diproses",
                    "validation_errors": content_validation.get("errors", []),
                    "validation_warnings": content_validation.get("warnings", [])
                })
        else:
            # Untuk file yang strukturnya tidak valid, kita masih bisa coba proses
            # dengan validasi konten langsung
            content_validation = validate_pdf_content_detailed(pdf_file)
            valid_files.append({
                "filename": filename,
                "file_path": pdf_file,
                "page_count": file_validation["page_count"],
                "pages_present": [],  # Struktur tidak valid
                "extracted_data": content_validation["extracted_data"],
                "validation_details": content_validation["validation_details"],
                "validation_status": content_validation["valid"],
                "warnings": content_validation.get("warnings", []) + [f"Struktur file tidak valid: {file_validation['message']}"],
                "errors": content_validation.get("errors", [])
            })
            
            validation_warnings.append({
                "filename": filename,
                "warning": f"Struktur file tidak valid tapi data tetap diproses: {file_validation['message']}",
                "missing_pages": file_validation.get("missing_pages", [])
            })
    
    # Kumpulkan semua data yang berhasil diekstrak
    all_extracted_data = []
    for valid_file in valid_files:
        if valid_file.get("extracted_data"):
            all_extracted_data.append(valid_file["extracted_data"])
    
    # Return success dengan data yang berhasil diekstrak
    # Meskipun ada warning, data tetap diproses
    return {
        "valid": True,  # SELALU TRUE KARENA DATA TETAP DIPROSES
        "message": f"Berhasil mengekstrak data dari {len(valid_files)} file. {len(validation_warnings)} warning ditemukan.",
        "valid_files": valid_files,
        "warnings": validation_warnings,
        "extracted_data": all_extracted_data,
        "total_files_processed": len(valid_files),
        "files_with_warnings": len(validation_warnings)
    }

# ============================================================
# FUNGSI UTAMA UNTUK TESTING
# ============================================================
def main():
    """Fungsi utama untuk testing"""
    pdf_path = "SEP1_removed_merged.pdf"  # Ganti dengan path file Anda
    
    if not os.path.exists(pdf_path):
        print(f"File {pdf_path} tidak ditemukan!")
        return
    
    print("Memulai validasi PDF...")
    result = validate_pdf_content_detailed(pdf_path)
    
    # Print summary
    print("\n" + "="*50)
    print("SUMMARY VALIDASI")
    print("="*50)
    print(f"Status: {'VALID' if result['valid'] else 'DENGAN WARNING'}")
    print(f"Pesan: {result['message']}")
    
    if result.get('warnings'):
        print("\nWarning yang ditemukan:")
        for warning in result.get('warnings', []):
            print(f"  - {warning}")
    
    if not result['valid']:
        print("\nError yang ditemukan:")
        for error in result.get('errors', []):
            print(f"  - {error}")

if __name__ == "__main__":
    main()