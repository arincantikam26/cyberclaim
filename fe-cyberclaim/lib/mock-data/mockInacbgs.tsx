// data/mockInacbgs.ts
import { InacbgsTarif } from '@/types/inacbgs';

export const mockInacbgs: InacbgsTarif[] = [
  {
    id: '1',
    kode_cbg: '001',
    nama_cbg: 'Demam Tifoid tanpa Komplikasi',
    kelas_rawat: 'Rendah',
    tarif: 2850000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'A01.0',
          deskripsi: 'Typhoid fever',
          tarif: 1500000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9902',
          deskripsi: 'Konsultasi Dokter Spesialis',
          tarif: 350000
        },
        {
          kode_icd9: '9903',
          deskripsi: 'Pemberian Antibiotik',
          tarif: 500000
        },
        {
          kode_icd9: '9904',
          deskripsi: 'Observasi 24 Jam',
          tarif: 250000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    kode_cbg: '002',
    nama_cbg: 'Pneumonia Community Acquired',
    kelas_rawat: 'Sedang',
    tarif: 4250000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'J18.9',
          deskripsi: 'Pneumonia, unspecified',
          tarif: 1800000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9905',
          deskripsi: 'Rontgen Thorax',
          tarif: 450000
        },
        {
          kode_icd9: '9906',
          deskripsi: 'Terapi Oksigen',
          tarif: 300000
        },
        {
          kode_icd9: '9907',
          deskripsi: 'Pemberian Antibiotik IV',
          tarif: 750000
        },
        {
          kode_icd9: '9908',
          deskripsi: 'Fisioterapi Dada',
          tarif: 200000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    kode_cbg: '003',
    nama_cbg: 'Appendicitis Akut',
    kelas_rawat: 'Tinggi',
    tarif: 7850000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'K35.9',
          deskripsi: 'Acute appendicitis, unspecified',
          tarif: 2200000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9909',
          deskripsi: 'USG Abdomen',
          tarif: 400000
        },
        {
          kode_icd9: '9910',
          deskripsi: 'Appendektomi',
          tarif: 3500000
        },
        {
          kode_icd9: '9911',
          deskripsi: 'Anestesi Umum',
          tarif: 800000
        },
        {
          kode_icd9: '9912',
          deskripsi: 'Perawatan Pasca Bedah',
          tarif: 700000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    kode_cbg: '004',
    nama_cbg: 'Diabetes Mellitus dengan Komplikasi',
    kelas_rawat: 'Sedang',
    tarif: 3650000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'E11.9',
          deskripsi: 'Type 2 diabetes mellitus without complications',
          tarif: 1600000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9913',
          deskripsi: 'Pemeriksaan Gula Darah Serial',
          tarif: 300000
        },
        {
          kode_icd9: '9914',
          deskripsi: 'Konsultasi Endokrin',
          tarif: 450000
        },
        {
          kode_icd9: '9915',
          deskripsi: 'Edukasi Diabetes',
          tarif: 150000
        },
        {
          kode_icd9: '9916',
          deskripsi: 'Pemberian Insulin',
          tarif: 900000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    kode_cbg: '005',
    nama_cbg: 'Fraktur Femur Tertutup',
    kelas_rawat: 'Tinggi',
    tarif: 9250000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'S72.0',
          deskripsi: 'Fracture of neck of femur',
          tarif: 2400000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9917',
          deskripsi: 'Rontgen Extremitas',
          tarif: 350000
        },
        {
          kode_icd9: '9918',
          deskripsi: 'Operasi Fiksasi Interna',
          tarif: 4500000
        },
        {
          kode_icd9: '9911',
          deskripsi: 'Anestesi Umum',
          tarif: 800000
        },
        {
          kode_icd9: '9919',
          deskripsi: 'Rehabilitasi Medik',
          tarif: 950000
        },
        {
          kode_icd9: '9912',
          deskripsi: 'Perawatan Pasca Bedah',
          tarif: 700000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    kode_cbg: '006',
    nama_cbg: 'Hipertensi Esensial',
    kelas_rawat: 'Rendah',
    tarif: 1850000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'I10',
          deskripsi: 'Essential (primary) hypertension',
          tarif: 1200000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9920',
          deskripsi: 'Pemeriksaan Tekanan Darah Serial',
          tarif: 150000
        },
        {
          kode_icd9: '9921',
          deskripsi: 'EKG',
          tarif: 250000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    kode_cbg: '007',
    nama_cbg: 'Partus Normal',
    kelas_rawat: 'Sedang',
    tarif: 3250000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'O80',
          deskripsi: 'Single spontaneous delivery',
          tarif: 1500000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9922',
          deskripsi: 'Persalinan Normal',
          tarif: 1200000
        },
        {
          kode_icd9: '9923',
          deskripsi: 'Perawatan Bayi Baru Lahir',
          tarif: 300000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    kode_cbg: '008',
    nama_cbg: 'Stroke Iskemik Akut',
    kelas_rawat: 'Special',
    tarif: 12500000,
    komponen_tarif: {
      diagnosis: [
        {
          kode_icd10: 'I63.9',
          deskripsi: 'Cerebral infarction, unspecified',
          tarif: 3000000
        }
      ],
      tindakan: [
        {
          kode_icd9: '9901',
          deskripsi: 'Pemeriksaan Fisik Komprehensif',
          tarif: 250000
        },
        {
          kode_icd9: '9924',
          deskripsi: 'CT Scan Kepala',
          tarif: 1200000
        },
        {
          kode_icd9: '9925',
          deskripsi: 'Terapi Trombolitik',
          tarif: 3500000
        },
        {
          kode_icd9: '9926',
          deskripsi: 'Perawatan ICU',
          tarif: 2500000
        },
        {
          kode_icd9: '9927',
          deskripsi: 'Fisioterapi Neurologi',
          tarif: 800000
        },
        {
          kode_icd9: '9928',
          deskripsi: 'Konsultasi Neurologi',
          tarif: 750000
        }
      ]
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];