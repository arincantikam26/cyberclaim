// lib/mock-data/patients.ts
import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    birth_date: '1985-03-15',
    gender: 'L',
    telp: '081234567890',
    address: 'Jl. Merdeka No. 123, Jakarta Pusat',
    nik: '3172031503850001',
    bpjs_number: '0001234567890',
    membership_json: JSON.stringify({
      type: 'Premium',
      tier: 'Gold',
      number: 'MBR001',
      start_date: '2023-01-15',
      end_date: '2024-01-15'
    }),
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    birth_date: '1990-07-22',
    gender: 'P',
    telp: '081298765432',
    address: 'Jl. Sudirman No. 456, Jakarta Selatan',
    nik: '3174032207900002',
    bpjs_number: '0001234567891',
    membership_json: JSON.stringify({
      type: 'Standard',
      tier: 'Silver',
      number: 'MBR002',
      start_date: '2023-02-20',
      end_date: '2024-02-20'
    }),
    is_active: true,
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Budi Santoso',
    birth_date: '1978-12-10',
    gender: 'L',
    telp: '081312345678',
    address: 'Jl. Thamrin No. 789, Jakarta Pusat',
    nik: '3172031012780003',
    bpjs_number: '0001234567892',
    membership_json: null,
    is_active: true,
    created_at: '2023-03-10T09:15:00Z',
    updated_at: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Maya Sari',
    birth_date: '1995-04-18',
    gender: 'P',
    telp: '081387654321',
    address: 'Jl. Gatot Subroto No. 321, Jakarta Selatan',
    nik: '3174031804950004',
    bpjs_number: '0001234567893',
    membership_json: JSON.stringify({
      type: 'Basic',
      tier: 'Bronze',
      number: 'MBR004',
      start_date: '2023-04-05',
      end_date: '2024-04-05'
    }),
    is_active: false,
    created_at: '2023-04-05T11:45:00Z',
    updated_at: '2023-06-20T16:20:00Z'
  },
  {
    id: '5',
    name: 'Rizki Pratama',
    birth_date: '1988-09-30',
    gender: 'L',
    telp: '081345678901',
    address: 'Jl. Asia Afrika No. 159, Bandung',
    nik: '3273093009880005',
    bpjs_number: '0001234567894',
    membership_json: JSON.stringify({
      type: 'Premium',
      tier: 'Platinum',
      number: 'MBR005',
      start_date: '2023-05-12',
      end_date: '2024-05-12'
    }),
    is_active: true,
    created_at: '2023-05-12T13:20:00Z',
    updated_at: '2023-05-12T13:20:00Z'
  },
  {
    id: '6',
    name: 'Dewi Anggraini',
    birth_date: '1992-11-25',
    gender: 'P',
    telp: '081376543210',
    address: 'Jl. Pahlawan No. 246, Surabaya',
    nik: '3578022511920006',
    bpjs_number: '0001234567895',
    membership_json: null,
    is_active: true,
    created_at: '2023-06-08T08:50:00Z',
    updated_at: '2023-06-08T08:50:00Z'
  },
  {
    id: '7',
    name: 'Hendra Gunawan',
    birth_date: '1983-06-14',
    gender: 'L',
    telp: '081398765432',
    address: 'Jl. Diponegoro No. 753, Semarang',
    nik: '3374061406830007',
    bpjs_number: '0001234567896',
    membership_json: JSON.stringify({
      type: 'Standard',
      tier: 'Silver',
      number: 'MBR007',
      start_date: '2023-07-01',
      end_date: '2024-07-01'
    }),
    is_active: true,
    created_at: '2023-07-01T15:10:00Z',
    updated_at: '2023-07-01T15:10:00Z'
  },
  {
    id: '8',
    name: 'Linda Wati',
    birth_date: '1993-02-28',
    gender: 'P',
    telp: '081365432198',
    address: 'Jl. Ahmad Yani No. 852, Medan',
    nik: '1275022802930008',
    bpjs_number: '0001234567897',
    membership_json: JSON.stringify({
      type: 'Basic',
      tier: 'Bronze',
      number: 'MBR008',
      start_date: '2023-08-18',
      end_date: '2024-08-18'
    }),
    is_active: true,
    created_at: '2023-08-18T12:30:00Z',
    updated_at: '2023-08-18T12:30:00Z'
  },
  {
    id: '9',
    name: 'Fajar Nugroho',
    birth_date: '1987-08-17',
    gender: 'L',
    telp: '081354321876',
    address: 'Jl. Sisingamangaraja No. 147, Yogyakarta',
    nik: '3474081708870009',
    bpjs_number: '0001234567898',
    membership_json: null,
    is_active: false,
    created_at: '2023-09-25T10:05:00Z',
    updated_at: '2023-11-10T14:45:00Z'
  },
  {
    id: '10',
    name: 'Rina Melati',
    birth_date: '1991-05-12',
    gender: 'P',
    telp: '081343219876',
    address: 'Jl. Hayam Wuruk No. 963, Denpasar',
    nik: '5171121205910010',
    bpjs_number: '0001234567899',
    membership_json: JSON.stringify({
      type: 'Premium',
      tier: 'Gold',
      number: 'MBR010',
      start_date: '2023-10-30',
      end_date: '2024-10-30'
    }),
    is_active: true,
    created_at: '2023-10-30T16:40:00Z',
    updated_at: '2023-10-30T16:40:00Z'
  },
  {
    id: '11',
    name: 'Joko Susilo',
    birth_date: '1980-01-20',
    gender: 'L',
    telp: '081332198765',
    address: 'Jl. Merpati No. 55, Malang',
    nik: '3573012001800011',
    bpjs_number: '0001234567900',
    membership_json: JSON.stringify({
      type: 'Standard',
      tier: 'Silver',
      number: 'MBR011',
      start_date: '2023-11-15',
      end_date: '2024-11-15'
    }),
    is_active: true,
    created_at: '2023-11-15T09:25:00Z',
    updated_at: '2023-11-15T09:25:00Z'
  },
  {
    id: '12',
    name: 'Ani Lestari',
    birth_date: '1986-10-05',
    gender: 'P',
    telp: '081321987654',
    address: 'Jl. Kenanga No. 88, Bogor',
    nik: '3271050510860012',
    bpjs_number: '0001234567901',
    membership_json: null,
    is_active: true,
    created_at: '2023-12-01T14:15:00Z',
    updated_at: '2023-12-01T14:15:00Z'
  },
  {
    id: '13',
    name: 'Rudi Hermawan',
    birth_date: '1975-03-12',
    gender: 'L',
    telp: '081310987654',
    address: 'Jl. Cendrawasih No. 33, Makassar',
    nik: '7371121203750013',
    bpjs_number: '0001234567902',
    membership_json: JSON.stringify({
      type: 'Premium',
      tier: 'Platinum',
      number: 'MBR013',
      start_date: '2024-01-10',
      end_date: '2025-01-10'
    }),
    is_active: true,
    created_at: '2024-01-10T08:20:00Z',
    updated_at: '2024-01-10T08:20:00Z'
  },
  {
    id: '14',
    name: 'Sari Indah',
    birth_date: '1994-08-25',
    gender: 'P',
    telp: '081399887766',
    address: 'Jl. Mawar No. 77, Palembang',
    nik: '1674082508940014',
    bpjs_number: '0001234567903',
    membership_json: JSON.stringify({
      type: 'Basic',
      tier: 'Bronze',
      number: 'MBR014',
      start_date: '2024-02-14',
      end_date: '2025-02-14'
    }),
    is_active: true,
    created_at: '2024-02-14T11:30:00Z',
    updated_at: '2024-02-14T11:30:00Z'
  },
  {
    id: '15',
    name: 'Bambang Supriyadi',
    birth_date: '1982-11-30',
    gender: 'L',
    telp: '081388776655',
    address: 'Jl. Melati No. 12, Balikpapan',
    nik: '6471113011820015',
    bpjs_number: '0001234567904',
    membership_json: null,
    is_active: false,
    created_at: '2024-03-05T16:45:00Z',
    updated_at: '2024-03-20T10:15:00Z'
  }
];