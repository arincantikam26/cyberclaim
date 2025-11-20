// lib/api/patients.ts
import { Patient, PatientFormData } from '@/types/patient';
import { mockPatients } from '@/lib/mock-data/patients';

// --- Types ---
export interface PatientQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PatientsResponse {
  data: Patient[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Get Patients With Pagination ---
export async function getPatients(query?: PatientQuery): Promise<PatientsResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;
  const search = query?.search?.toLowerCase() || '';

  // Filter patients based on search
  let filteredPatients = mockPatients;
  if (search) {
    filteredPatients = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(search) ||
      patient.nik.includes(search) ||
      patient.bpjs_number.includes(search) ||
      patient.telp.includes(search)
    );
  }

  // Sort by latest created first
  filteredPatients.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filteredPatients.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredPatients.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Patient ---
export async function getPatient(id: string): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const patient = mockPatients.find(p => p.id === id);
  if (!patient) throw new Error('Patient not found');

  return patient;
}

// --- Create Patient ---
export async function createPatient(data: PatientFormData): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validation
  if (!data.name || !data.nik || !data.birth_date || !data.telp || !data.address) {
    throw new Error('Required fields are missing');
  }

  // Validate NIK (16 digits)
  if (!/^\d{16}$/.test(data.nik)) {
    throw new Error('NIK must be 16 digits');
  }

  // Check for duplicate NIK
  const existingPatient = mockPatients.find(patient => patient.nik === data.nik);
  if (existingPatient) {
    throw new Error('Patient with this NIK already exists');
  }

  const newPatient: Patient = {
    ...data,
    id: (mockPatients.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockPatients.unshift(newPatient);
  return newPatient;
}

// --- Update Patient ---
export async function updatePatient(id: string, data: PatientFormData): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const idx = mockPatients.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Patient not found');

  // Validation
  if (!data.name || !data.nik || !data.birth_date || !data.telp || !data.address) {
    throw new Error('Required fields are missing');
  }

  // Validate NIK (16 digits)
  if (!/^\d{16}$/.test(data.nik)) {
    throw new Error('NIK must be 16 digits');
  }

  // Check for duplicate NIK (excluding current patient)
  const existingPatient = mockPatients.find(
    patient => patient.nik === data.nik && patient.id !== id
  );
  if (existingPatient) {
    throw new Error('Another patient with this NIK already exists');
  }

  mockPatients[idx] = {
    ...mockPatients[idx],
    ...data,
    updated_at: new Date().toISOString()
  };

  return mockPatients[idx];
}

// --- Delete Patient ---
export async function deletePatient(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const idx = mockPatients.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Patient not found');

  mockPatients.splice(idx, 1);
}

// --- Toggle Patient Status ---
export async function togglePatientStatus(id: string): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockPatients.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Patient not found');

  const updatedPatient: Patient = {
    ...mockPatients[idx],
    is_active: !mockPatients[idx].is_active,
    updated_at: new Date().toISOString()
  };

  mockPatients[idx] = updatedPatient;
  return updatedPatient;
}

// --- Get Patient Statistics ---
export async function getPatientStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  withMembership: number;
  byGender: { male: number; female: number };
  byAgeGroup: { young: number; adult: number; senior: number };
}> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const total = mockPatients.length;
  const active = mockPatients.filter(p => p.is_active).length;
  const inactive = mockPatients.filter(p => !p.is_active).length;
  const withMembership = mockPatients.filter(p => p.membership_json !== null).length;
  
  const male = mockPatients.filter(p => p.gender === 'L').length;
  const female = mockPatients.filter(p => p.gender === 'P').length;

  // Calculate age groups
  const today = new Date();
  const young = mockPatients.filter(p => {
    const birthDate = new Date(p.birth_date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age < 25;
  }).length;
  
  const adult = mockPatients.filter(p => {
    const birthDate = new Date(p.birth_date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 25 && age < 60;
  }).length;
  
  const senior = mockPatients.filter(p => {
    const birthDate = new Date(p.birth_date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 60;
  }).length;

  return {
    total,
    active,
    inactive,
    withMembership,
    byGender: { male, female },
    byAgeGroup: { young, adult, senior }
  };
}

// --- Search Patients ---
export async function searchPatients(term: string): Promise<Patient[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!term.trim()) {
    return mockPatients.slice(0, 10);
  }

  const searchTerm = term.toLowerCase();
  return mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm) ||
    patient.nik.includes(searchTerm) ||
    patient.bpjs_number.includes(searchTerm) ||
    patient.telp.includes(searchTerm)
  ).slice(0, 10);
}

// --- Get Patients by Status ---
export async function getPatientsByStatus(isActive: boolean): Promise<Patient[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  return mockPatients
    .filter(patient => patient.is_active === isActive)
    .slice(0, 50);
}

// --- Validate NIK ---
export async function validateNIK(nik: string, excludeId?: string): Promise<{ valid: boolean; message?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!/^\d{16}$/.test(nik)) {
    return { valid: false, message: 'NIK harus 16 digit angka' };
  }

  const existingPatient = mockPatients.find(
    patient => patient.nik === nik && patient.id !== excludeId
  );
  if (existingPatient) {
    return { valid: false, message: 'NIK sudah terdaftar' };
  }

  return { valid: true };
}