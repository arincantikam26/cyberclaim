// lib/api/validationResults.ts
import { ValidationResult, ValidationStats } from '@/types/validation';
import { mockValidationResults } from '@/lib/mock-data/validationResults';

export interface ValidationResultQuery {
  page?: number;
  limit?: number;
  batch_id?: string;
  status?: string;
  validation_type?: string;
}

export interface ValidationResultsResponse {
  data: ValidationResult[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Get Validation Results ---
export async function getValidationResults(query?: ValidationResultQuery): Promise<ValidationResultsResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;

  let filteredResults = mockValidationResults;

  if (query?.batch_id) {
    filteredResults = filteredResults.filter(result => result.batch_id === query.batch_id);
  }

  if (query?.status) {
    filteredResults = filteredResults.filter(result => result.status === query.status);
  }

  if (query?.validation_type) {
    filteredResults = filteredResults.filter(result => result.validation_type === query.validation_type);
  }

  // Sort by latest created first
  filteredResults.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filteredResults.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredResults.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Result ---
export async function getValidationResult(id: string): Promise<ValidationResult> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const result = mockValidationResults.find(r => r.id === id);
  if (!result) throw new Error('Validation result not found');

  return result;
}

// --- Create Validation Result ---
export async function createValidationResult(data: Omit<ValidationResult, 'id' | 'created_at' | 'updated_at'>): Promise<ValidationResult> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newResult: ValidationResult = {
    ...data,
    id: (mockValidationResults.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockValidationResults.unshift(newResult);
  return newResult;
}

// --- Update Result Resolved Notes ---
export async function updateResultNotes(id: string, resolved_notes: string): Promise<ValidationResult> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockValidationResults.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Validation result not found');

  const updatedResult: ValidationResult = {
    ...mockValidationResults[idx],
    resolved_notes,
    updated_at: new Date().toISOString()
  };

  mockValidationResults[idx] = updatedResult;
  return updatedResult;
}

// --- Get Validation Stats ---
export async function getValidationStats(batch_id?: string): Promise<ValidationStats> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let results = mockValidationResults;

  if (batch_id) {
    results = results.filter(result => result.batch_id === batch_id);
  }

  const total = results.length;
  const valid = results.filter(r => r.status === 'valid').length;
  const invalid = results.filter(r => r.status === 'invalid').length;
  const warning = results.filter(r => r.status === 'warning').length;
  const resolved = results.filter(r => !!r.resolved_notes).length;

  return {
    total,
    valid,
    invalid,
    warning,
    resolved
  };
}