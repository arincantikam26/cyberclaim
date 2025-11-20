export const claimDummy = [
    {
      id: 'CLM-2024-001',
      patientName: 'Budi Santoso',
      faskes: 'RS Mitra Sehat',
      diagnosis: 'Pneumonia',
      procedure: '00.10 - Injection of thrombolytic',
      amount: 1250000,
      status: 'pending',
      submissionDate: '2024-01-15',
      verificationDate: null,
      bpjsNumber: '0001234567890',
      doctor: 'Dr. Ahmad Wijaya',
      priority: 'high',
      fraudScore: 12
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Siti Rahayu',
      faskes: 'Klinik Sehat Sentosa',
      diagnosis: 'Hypertension',
      procedure: '00.11 - Other injection',
      amount: 850000,
      status: 'approved',
      submissionDate: '2024-01-14',
      verificationDate: '2024-01-15',
      bpjsNumber: '0001234567891',
      doctor: 'Dr. Maria Sari',
      priority: 'normal',
      fraudScore: 5
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Ahmad Hidayat',
      faskes: 'RS Siloam',
      diagnosis: 'Diabetes Mellitus',
      procedure: '00.12 - PTCA',
      amount: 3500000,
      status: 'rejected',
      submissionDate: '2024-01-13',
      verificationDate: '2024-01-14',
      bpjsNumber: '0001234567892',
      doctor: 'Dr. Robert Chandra',
      priority: 'high',
      fraudScore: 85
    },
    {
      id: 'CLM-2024-004',
      patientName: 'Dewi Anggraini',
      faskes: 'RS Premier',
      diagnosis: 'Appendicitis',
      procedure: '00.13 - Appendectomy',
      amount: 2750000,
      status: 'verified',
      submissionDate: '2024-01-12',
      verificationDate: '2024-01-13',
      bpjsNumber: '0001234567893',
      doctor: 'Dr. Lisa Permata',
      priority: 'normal',
      fraudScore: 8
    },
    {
      id: 'CLM-2024-005',
      patientName: 'Rizki Pratama',
      faskes: 'RS Umum Daerah',
      diagnosis: 'Fracture Femur',
      procedure: '00.14 - Osteosynthesis',
      amount: 4200000,
      status: 'pending',
      submissionDate: '2024-01-11',
      verificationDate: null,
      bpjsNumber: '0001234567894',
      doctor: 'Dr. Andi Wijaya',
      priority: 'urgent',
      fraudScore: 25
    }
];

export const faskesDummy = [
    {
      code: "RSUD-JKT-001",
      name: "RSUD Budi Mulia",
      telp: "(021) 1234567",
      website: "https://rsudbudimulia.jakarta.go.id",
      address: "Jl. Kesehatan Raya No. 123",
      province: "DKI Jakarta",
      city: "Jakarta Pusat",
      jenis_sarana_id: 1,
      operasional: true
    },
    {
      code: "RSUD-BDG-002",
      name: "RSUD Harapan Sehat",
      telp: "(022) 7654321",
      website: "https://harapansehat.bandung.go.id",
      address: "Jl. Sukajadi No. 45",
      province: "Jawa Barat",
      city: "Bandung",
      jenis_sarana_id: 2,
      operasional: true
    },
    {
      code: "RSIA-SBY-003",
      name: "RSIA Srikandi",
      telp: "(031) 5566778",
      website: "https://rsia-srikandi.surabaya.go.id",
      address: "Jl. Pahlawan No. 67",
      province: "Jawa Timur",
      city: "Surabaya",
      jenis_sarana_id: 3,
      operasional: false
    },
    {
      code: "RSK-BLI-004",
      name: "RS Khusus Bali Sehat",
      telp: "(0361) 4455667",
      website: "https://balisehat.bali.go.id",
      address: "Jl. Dewata No. 99",
      province: "Bali",
      city: "Denpasar",
      jenis_sarana_id: 4,
      operasional: true
    },
    {
      code: "RS-SMG-005",
      name: "RS Permata Semarang",
      telp: "(024) 9988776",
      website: "https://permatasmg.jateng.go.id",
      address: "Jl. Sisingamangaraja No. 12",
      province: "Jawa Tengah",
      city: "Semarang",
      jenis_sarana_id: 1,
      operasional: true
    }
];
  

import { Doctor } from '@/types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    facility_id: '1',
    facility_name: 'RSUD Budi Mulia',
    name: 'Dr. Ahmad Wijaya, Sp.JP',
    specialization: 'Spesialis Jantung',
    bpjs_id: '198005150001',
    birth_date: '1980-05-15',
    gender: 'L',
    telp: '(021) 1234-5678',
    address: 'Jl. Kesehatan No. 123, Menteng, Jakarta Pusat 10310',
    is_active: true,
    created_at: '2023-01-15T08:30:00Z',
    updated_at: '2024-01-10T14:20:00Z'
  },
  {
    id: '2',
    facility_id: '1',
    facility_name: 'RSUD Budi Mulia',
    name: 'Dr. Maria Sari, Sp.PD',
    specialization: 'Spesialis Penyakit Dalam',
    bpjs_id: '198508200002',
    birth_date: '1985-08-20',
    gender: 'P',
    telp: '(021) 2345-6789',
    address: 'Jl. Sehat No. 456, Kebayoran Baru, Jakarta Selatan 12120',
    is_active: true,
    created_at: '2023-02-20T09:15:00Z',
    updated_at: '2024-01-12T10:45:00Z'
  },
  {
    id: '3',
    facility_id: '2',
    facility_name: 'RS Siloam',
    name: 'Dr. Robert Chandra, Sp.B',
    specialization: 'Spesialis Bedah',
    bpjs_id: '197812030003',
    birth_date: '1978-12-03',
    gender: 'L',
    telp: '(021) 3456-7890',
    address: 'Jl. Bedah Raya No. 789, Palmerah, Jakarta Barat 11480',
    is_active: true,
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2024-01-08T16:30:00Z'
  },
  {
    id: '4',
    facility_id: '3',
    facility_name: 'Klinik Sehat Sentosa',
    name: 'Dr. Lisa Permata, Sp.A',
    specialization: 'Spesialis Anak',
    bpjs_id: '199002140004',
    birth_date: '1990-02-14',
    gender: 'P',
    telp: '(021) 4567-8901',
    address: 'Jl. Anak Sehat No. 321, Cempaka Putih, Jakarta Pusat 10510',
    is_active: false,
    created_at: '2023-04-05T11:45:00Z',
    updated_at: '2023-12-20T09:15:00Z'
  },
  {
    id: '5',
    facility_id: '4',
    facility_name: 'RS Premier',
    name: 'Dr. Budi Santoso, Sp.OG',
    specialization: 'Spesialis Kandungan',
    bpjs_id: '198306250005',
    birth_date: '1983-06-25',
    gender: 'L',
    telp: '(021) 5678-9012',
    address: 'Jl. Kebidanan No. 654, Tanjung Priok, Jakarta Utara 14350',
    is_active: true,
    created_at: '2023-05-12T13:20:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  },
  {
    id: '6',
    facility_id: '2',
    facility_name: 'RS Siloam',
    name: 'Dr. Siti Rahayu, Sp.KK',
    specialization: 'Spesialis Kulit',
    bpjs_id: '198709180006',
    birth_date: '1987-09-18',
    gender: 'P',
    telp: '(021) 6789-0123',
    address: 'Jl. Kulit Sehat No. 987, Kemayoran, Jakarta Pusat 10620',
    is_active: true,
    created_at: '2023-06-18T14:10:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  }
];