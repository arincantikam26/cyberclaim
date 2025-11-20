// lib/api/doctors.ts
import { Doctor, DoctorFormData } from '@/types/doctor';
import { mockDoctors } from '@/lib/mock-data/doctors';

// --- Types ---
export interface DoctorQuery {
  page?: number;
  limit?: number;
}

export interface DoctorsResponse {
  data: Doctor[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Get Doctors With Pagination ---
export async function getDoctors(query?: DoctorQuery): Promise<DoctorsResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;

  const total = mockDoctors.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = mockDoctors.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Doctor ---
export async function getDoctor(id: string): Promise<Doctor> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const doctor = mockDoctors.find(d => d.id === id);
  if (!doctor) throw new Error('Doctor not found');

  return doctor;
}

// --- Create Doctor ---
export async function createDoctor(data: DoctorFormData): Promise<Doctor> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newDoctor: Doctor = {
    ...data,
    id: (mockDoctors.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockDoctors.push(newDoctor);
  return newDoctor;
}

// --- Update Doctor ---
export async function updateDoctor(id: string, data: DoctorFormData): Promise<Doctor> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const idx = mockDoctors.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Doctor not found');

  mockDoctors[idx] = {
    ...mockDoctors[idx],
    ...data,
    updated_at: new Date().toISOString()
  };

  return mockDoctors[idx];
}

// --- Delete Doctor ---
export async function deleteDoctor(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const idx = mockDoctors.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Doctor not found');

  mockDoctors.splice(idx, 1);
}
