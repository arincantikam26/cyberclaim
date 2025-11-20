// lib/mock-data/faskes.ts
import { Faskes } from '@/types/faskes';

export const mockFaskes: Faskes[] = [
  {
    id: '1',
    code: 'RSUD-JKT-001',
    name: 'RSUD Budi Mulia',
    telp: '(021) 1234567',
    website: 'https://rsudbudimulia.jakarta.go.id',
    address: 'Jl. Kesehatan Raya No. 123',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    jenis_sarana_id: 1,
    operasional: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    code: 'RS-SILOAM-001',
    name: 'RS Siloam',
    telp: '(021) 2345678',
    website: 'https://siloamhospitals.com',
    address: 'Jl. Jenderal Sudirman Kav. 1',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    jenis_sarana_id: 1,
    operasional: true,
    created_at: '2024-01-02',
    updated_at: '2024-01-02'
  },
  {
    id: '3',
    code: 'KLINIK-SS-001',
    name: 'Klinik Sehat Sentosa',
    telp: '(021) 3456789',
    website: 'https://kliniksehatsentosa.com',
    address: 'Jl. Kesehatan No. 45',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    jenis_sarana_id: 2,
    operasional: true,
    created_at: '2024-01-03',
    updated_at: '2024-01-03'
  },
  {
    id: '4',
    code: 'RS-PREMIER-001',
    name: 'RS Premier',
    telp: '(021) 4567890',
    website: 'https://rspremier.com',
    address: 'Jl. Medan Merdeka No. 10',
    province: 'DKI Jakarta',
    city: 'Jakarta Utara',
    jenis_sarana_id: 1,
    operasional: true,
    created_at: '2024-01-04',
    updated_at: '2024-01-04'
  }
];