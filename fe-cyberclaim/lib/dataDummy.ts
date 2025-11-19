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
  