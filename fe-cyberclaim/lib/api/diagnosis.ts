// lib/api/diagnosis.ts
import { Diagnosis, DiagnosisFormData, DiagnosisResponse } from '@/types/diagnosis';
import { mockDiagnosis } from '@/lib/mock-data/diagnosis';

// --- Get Diagnosis With Pagination ---
export async function getDiagnosis(query?: any): Promise<DiagnosisResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;
  const search = query?.search?.toLowerCase() || '';

  // Filter diagnosis based on search
  let filteredDiagnosis = mockDiagnosis;
  if (search) {
    filteredDiagnosis = mockDiagnosis.filter(diagnosis =>
      diagnosis.code.toLowerCase().includes(search) ||
      diagnosis.description.toLowerCase().includes(search)
    );
  }

  // Sort by code
  filteredDiagnosis.sort((a, b) => a.code.localeCompare(b.code));

  const total = filteredDiagnosis.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredDiagnosis.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Diagnosis ---
export async function getDiagnosisById(id: string): Promise<Diagnosis> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const diagnosis = mockDiagnosis.find(d => d.id === id);
  if (!diagnosis) throw new Error('Diagnosis not found');

  return diagnosis;
}

// --- Create Diagnosis ---
export async function createDiagnosis(data: DiagnosisFormData): Promise<Diagnosis> {
  await new Promise(resolve => setTimeout(resolve, 600));

  // Validation
  if (!data.code || !data.description) {
    throw new Error('Code and description are required');
  }

  // Check for duplicate code
  const existingDiagnosis = mockDiagnosis.find(d => d.code === data.code);
  if (existingDiagnosis) {
    throw new Error('Diagnosis code already exists');
  }

  const newDiagnosis: Diagnosis = {
    ...data,
    id: (mockDiagnosis.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockDiagnosis.unshift(newDiagnosis);
  return newDiagnosis;
}

// --- Update Diagnosis ---
export async function updateDiagnosis(id: string, data: DiagnosisFormData): Promise<Diagnosis> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const idx = mockDiagnosis.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Diagnosis not found');

  // Check for duplicate code (excluding current)
  const existingCode = mockDiagnosis.find(
    d => d.code === data.code && d.id !== id
  );
  if (existingCode) {
    throw new Error('Diagnosis code already exists');
  }

  mockDiagnosis[idx] = {
    ...mockDiagnosis[idx],
    ...data,
    updated_at: new Date().toISOString()
  };

  return mockDiagnosis[idx];
}

// --- Delete Diagnosis ---
export async function deleteDiagnosis(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockDiagnosis.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Diagnosis not found');

  mockDiagnosis.splice(idx, 1);
}

// --- Search Diagnosis ---
export async function searchDiagnosis(term: string): Promise<Diagnosis[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!term.trim()) {
    return mockDiagnosis.slice(0, 10);
  }

  const searchTerm = term.toLowerCase();
  return mockDiagnosis.filter(diagnosis =>
    diagnosis.code.toLowerCase().includes(searchTerm) ||
    diagnosis.description.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
}

// --- Get Diagnosis Stats ---
export async function getDiagnosisStats(): Promise<{
  total: number;
  recent: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const total = mockDiagnosis.length;
  
  // Count diagnosis created in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recent = mockDiagnosis.filter(d => 
    new Date(d.created_at) > thirtyDaysAgo
  ).length;

  return {
    total,
    recent
  };
}