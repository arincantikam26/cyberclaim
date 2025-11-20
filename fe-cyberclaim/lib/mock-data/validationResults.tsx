// lib/mock-data/validationResults.ts
import { ValidationResult } from '@/types/validation';

export const mockValidationResults: ValidationResult[] = [
  {
    id: '1',
    batch_id: '1',
    validation_type: 'NIK Validation',
    status: 'valid',
    details: 'NIK 3172031503850001 valid dan terverifikasi',
    created_at: '2024-01-15T10:05:00Z',
    updated_at: '2024-01-15T10:05:00Z'
  },
  {
    id: '2',
    batch_id: '1',
    validation_type: 'BPJS Validation',
    status: 'warning',
    details: 'Nomor BPJS 0001234567890 perlu verifikasi manual',
    resolved_notes: 'Sudah diverifikasi oleh admin',
    created_at: '2024-01-15T10:07:00Z',
    updated_at: '2024-01-15T11:20:00Z'
  },
  {
    id: '3',
    batch_id: '1',
    validation_type: 'Data Completeness',
    status: 'invalid',
    details: 'Data alamat tidak lengkap untuk pasien ID P001',
    resolved_notes: 'Data sudah dilengkapi oleh front desk',
    created_at: '2024-01-15T10:10:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '4',
    batch_id: '2',
    validation_type: 'NIK Validation',
    status: 'invalid',
    details: 'NIK 1234567890123456 tidak valid (harus 16 digit)',
    created_at: '2024-01-16T09:20:00Z',
    updated_at: '2024-01-16T09:20:00Z'
  },
  {
    id: '5',
    batch_id: '2',
    validation_type: 'Phone Validation',
    status: 'valid',
    details: 'Nomor telepon 081234567890 valid',
    created_at: '2024-01-16T09:25:00Z',
    updated_at: '2024-01-16T09:25:00Z'
  },
  {
    id: '6',
    batch_id: '4',
    validation_type: 'Insurance Validation',
    status: 'failed',
    details: 'Gagal terhubung ke server BPJS',
    created_at: '2023-12-20T11:35:00Z',
    updated_at: '2023-12-20T11:35:00Z'
  },
  {
    id: '7',
    batch_id: '5',
    validation_type: 'Data Update',
    status: 'valid',
    details: 'Update data pasien berhasil',
    created_at: '2024-01-17T08:50:00Z',
    updated_at: '2024-01-17T08:50:00Z'
  }
];