// lib/mock-data/validationBatches.ts
import { ValidationBatch } from '@/types/validation';

export const mockValidationBatches: ValidationBatch[] = [
  {
    id: '1',
    filename: 'patient_data_january_2024.csv',
    status: 'completed',
    total_records: 150,
    processed_records: 150,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    filename: 'bpjs_validation_february_2024.csv',
    status: 'processing',
    total_records: 200,
    processed_records: 85,
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:45:00Z'
  },
  {
    id: '3',
    filename: 'member_data_march_2024.xlsx',
    status: 'pending',
    total_records: 75,
    processed_records: 0,
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: '4',
    filename: 'insurance_data_december_2023.csv',
    status: 'failed',
    total_records: 300,
    processed_records: 120,
    created_at: '2023-12-20T11:30:00Z',
    updated_at: '2023-12-20T12:15:00Z'
  },
  {
    id: '5',
    filename: 'patient_update_january_2024.csv',
    status: 'completed',
    total_records: 50,
    processed_records: 50,
    created_at: '2024-01-17T08:45:00Z',
    updated_at: '2024-01-17T09:10:00Z'
  }
];