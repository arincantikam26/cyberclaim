# import os
# import base64
# import tempfile
# from typing import Dict, Any, List
# from sqlalchemy.orm import Session
# import uuid
# from datetime import datetime

# from models import (
#     ValidationBatch, ValidationResult, SEPData, 
#     MedicalRecord, ReferralLetter
# )

# # Import fungsi validasi dari kode yang Anda berikan
# from main_validasi import validate_sep_flow, read_auto

# class SEPValidationService:
    
#     def validate_pdf_file(self, file_content: str, file_name: str) -> Dict[str, Any]:
#         """
#         Validasi file PDF yang berisi SEP, Rujukan, dan Rekam Medis
#         """
#         try:
#             # Decode base64 file content
#             pdf_bytes = base64.b64decode(file_content)
            
#             # Simpan file sementara
#             with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
#                 temp_file.write(pdf_bytes)
#                 temp_file_path = temp_file.name
            
#             # Baca dan validasi file menggunakan fungsi dari main_validasi
#             full_text = read_auto(temp_file_path)
            
#             # Pisahkan teks berdasarkan halaman
#             pages = full_text.split("=== HALAMAN")
            
#             # Ekstrak teks per halaman
#             sep_text = ""
#             rujukan_text = ""
#             rekam_medis_text = ""
            
#             for i, page in enumerate(pages):
#                 if "1" in page[:5]:  # Halaman 1 - SEP
#                     sep_text = page
#                 elif "2" in page[:5]:  # Halaman 2 - Rujukan
#                     rujukan_text = page
#                 elif "3" in page[:5] or "4" in page[:5]:  # Halaman 3-4 - Rekam Medis
#                     rekam_medis_text += page
            
#             # Jika tidak bisa dipisah berdasarkan halaman, gunakan teks lengkap untuk semua
#             if not sep_text:
#                 sep_text = full_text
#             if not rujukan_text:
#                 rujukan_text = full_text
#             if not rekam_medis_text:
#                 rekam_medis_text = full_text
            
#             # Lakukan validasi menggunakan fungsi dari main_validasi
#             validasi_result, sep_info, rujukan_info, rekam_medis_info = validate_sep_flow(
#                 sep_text, rujukan_text, rekam_medis_text
#             )
            
#             # Bersihkan file temporary
#             os.unlink(temp_file_path)
            
#             # Format response
#             return {
#                 'success': True,
#                 'validation_result': validasi_result,
#                 'sep_info': sep_info,
#                 'rujukan_info': rujukan_info,
#                 'rekam_medis_info': rekam_medis_info
#             }
            
#         except Exception as e:
#             return {
#                 'success': False,
#                 'error': str(e),
#                 'validation_result': None,
#                 'sep_info': None,
#                 'rujukan_info': None,
#                 'rekam_medis_info': None
#             }
    
#     def save_validation_to_db(self, db: Session, validation_data: Dict[str, Any], file_name: str) -> str:
#         """
#         Simpan hasil validasi ke database
#         """
#         try:
#             # Buat batch validation
#             batch_id = uuid.uuid4()
#             batch = ValidationBatch(
#                 id=batch_id,
#                 filename=file_name,
#                 status="completed"
#             )
#             db.add(batch)
#             db.flush()  # Flush untuk mendapatkan ID
            
#             # Simpan data SEP
#             sep_info = validation_data['sep_info']
#             if sep_info.get('no_sep'):
#                 diagnosa_sep = sep_info.get('diagnosa', [{}])[0] if sep_info.get('diagnosa') else {}
#                 sep_data = SEPData(
#                     id=uuid.uuid4(),
#                     batch_id=batch_id,
#                     no_sep=sep_info.get('no_sep', ''),
#                     tgl_sep=datetime.strptime(sep_info.get('tgl_sep', '2023-01-01'), '%Y-%m-%d') if sep_info.get('tgl_sep') else datetime.utcnow(),
#                     no_kartu=sep_info.get('no_kartu', ''),
#                     nama_pasien=sep_info.get('nama_pasien', ''),
#                     diagnosa_kode=diagnosa_sep.get('kode', ''),
#                     diagnosa_deskripsi=diagnosa_sep.get('deskripsi', ''),
#                     extracted_data=sep_info
#                 )
#                 db.add(sep_data)
            
#             # Simpan data Rekam Medis
#             rm_info = validation_data['rekam_medis_info']
#             if rm_info:
#                 diagnosa_rm = rm_info.get('diagnosa_rm', [{}])[0] if rm_info.get('diagnosa_rm') else {}
#                 medical_record = MedicalRecord(
#                     id=uuid.uuid4(),
#                     batch_id=batch_id,
#                     no_rm=rm_info.get('no_rekam_medis', ''),
#                     diagnosa_kode=diagnosa_rm.get('kode', ''),
#                     diagnosa_deskripsi=diagnosa_rm.get('deskripsi', ''),
#                     dpjp_signature=rm_info.get('tanda_tangan_dpip', False),
#                     nama_dpjp=rm_info.get('dokter_dpip', ''),
#                     extracted_data=rm_info
#                 )
#                 db.add(medical_record)
            
#             # Simpan data Rujukan
#             rujukan_info = validation_data['rujukan_info']
#             if rujukan_info:
#                 diagnosa_rujukan = rujukan_info.get('diagnosa_rujukan', [{}])[0] if rujukan_info.get('diagnosa_rujukan') else {}
#                 referral_letter = ReferralLetter(
#                     id=uuid.uuid4(),
#                     batch_id=batch_id,
#                     no_rujukan=rujukan_info.get('no_rujukan', ''),
#                     diagnosa_kode=diagnosa_rujukan.get('kode', ''),
#                     diagnosa_deskripsi=diagnosa_rujukan.get('deskripsi', ''),
#                     faskes_perujuk=rujukan_info.get('dokter_perujuk', ''),
#                     extracted_data=rujukan_info
#                 )
#                 db.add(referral_letter)
            
#             # Simpan hasil validasi
#             validasi_result = validation_data['validation_result']
            
#             # Validasi SEP
#             sep_validation = ValidationResult(
#                 id=uuid.uuid4(),
#                 batch_id=batch_id,
#                 validation_type="sep_validation",
#                 status="success" if validasi_result['sep']['field_wajib_ok'] and validasi_result['sep']['diagnosa_valid'] else "failed",
#                 details={
#                     "field_wajib_ok": validasi_result['sep']['field_wajib_ok'],
#                     "diagnosa_valid": validasi_result['sep']['diagnosa_valid'],
#                     "errors": validasi_result['sep']['errors'],
#                     "warnings": validasi_result['sep']['warnings']
#                 }
#             )
#             db.add(sep_validation)
            
#             # Validasi Rujukan
#             rujukan_validation = ValidationResult(
#                 id=uuid.uuid4(),
#                 batch_id=batch_id,
#                 validation_type="referral_validation",
#                 status="success" if validasi_result['rujukan']['field_wajib_ok'] and validasi_result['rujukan']['diagnosa_match_sep'] else "failed",
#                 details={
#                     "field_wajib_ok": validasi_result['rujukan']['field_wajib_ok'],
#                     "diagnosa_match": validasi_result['rujukan']['diagnosa_match_sep'],
#                     "errors": validasi_result['rujukan']['errors'],
#                     "warnings": validasi_result['rujukan']['warnings']
#                 }
#             )
#             db.add(rujukan_validation)
            
#             # Validasi Rekam Medis
#             rm_validation = ValidationResult(
#                 id=uuid.uuid4(),
#                 batch_id=batch_id,
#                 validation_type="medical_record_validation",
#                 status="success" if validasi_result['rekam_medis']['field_wajib_ok'] and validasi_result['rekam_medis']['tanda_tangan_ok'] else "failed",
#                 details={
#                     "field_wajib_ok": validasi_result['rekam_medis']['field_wajib_ok'],
#                     "diagnosa_match": validasi_result['rekam_medis']['diagnosa_match_sep'],
#                     "tanda_tangan_ok": validasi_result['rekam_medis']['tanda_tangan_ok'],
#                     "diagnosa_valid": validasi_result['rekam_medis']['diagnosa_valid'],
#                     "errors": validasi_result['rekam_medis']['errors'],
#                     "warnings": validasi_result['rekam_medis']['warnings']
#                 }
#             )
#             db.add(rm_validation)
            
#             # Commit semua perubahan
#             db.commit()
            
#             return str(batch_id)
            
#         except Exception as e:
#             db.rollback()
#             raise e

#     def get_validation_summary(self, db: Session, batch_id: str) -> Dict[str, Any]:
#         """
#         Get summary validasi dari database
#         """
#         try:
#             batch_uuid = uuid.UUID(batch_id)
#         except ValueError:
#             return None
        
#         batch = db.query(ValidationBatch).filter(ValidationBatch.id == batch_uuid).first()
#         if not batch:
#             return None
        
#         # Get related data
#         sep_data = db.query(SEPData).filter(SEPData.batch_id == batch_uuid).first()
#         medical_record = db.query(MedicalRecord).filter(MedicalRecord.batch_id == batch_uuid).first()
#         referral_letter = db.query(ReferralLetter).filter(ReferralLetter.batch_id == batch_uuid).first()
#         validation_results = db.query(ValidationResult).filter(ValidationResult.batch_id == batch_uuid).all()
        
#         return {
#             'batch': batch,
#             'sep_data': sep_data,
#             'medical_record': medical_record,
#             'referral_letter': referral_letter,
#             'validation_results': validation_results
#         }

# # Global instance
# validation_service = SEPValidationService()