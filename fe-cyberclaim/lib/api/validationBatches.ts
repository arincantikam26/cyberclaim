// lib/api/validationBatches.ts
import { ValidationBatch } from '@/types/validation';
import { mockValidationBatches } from '@/lib/mock-data/validationBatches';

export interface ValidationBatchQuery {
  page?: number;
  limit?: number;
  status?: string;
}

export interface ValidationBatchesResponse {
  data: ValidationBatch[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- Get Validation Batches ---
export async function getValidationBatches(query?: ValidationBatchQuery): Promise<ValidationBatchesResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;

  let filteredBatches = mockValidationBatches;

  if (query?.status) {
    filteredBatches = filteredBatches.filter(batch => batch.status === query.status);
  }

  // Sort by latest created first
  filteredBatches.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filteredBatches.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredBatches.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Batch ---
export async function getValidationBatch(id: string): Promise<ValidationBatch> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const batch = mockValidationBatches.find(b => b.id === id);
  if (!batch) throw new Error('Validation batch not found');

  return batch;
}

// --- Create Validation Batch ---
export async function createValidationBatch(filename: string, totalRecords: number): Promise<ValidationBatch> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const newBatch: ValidationBatch = {
    id: (mockValidationBatches.length + 1).toString(),
    filename,
    status: 'pending',
    total_records: totalRecords,
    processed_records: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockValidationBatches.unshift(newBatch);
  return newBatch;
}

// --- Update Batch Status ---
export async function updateBatchStatus(id: string, status: ValidationBatch['status'], processedRecords?: number): Promise<ValidationBatch> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockValidationBatches.findIndex(b => b.id === id);
  if (idx === -1) throw new Error('Validation batch not found');

  const updatedBatch: ValidationBatch = {
    ...mockValidationBatches[idx],
    status,
    updated_at: new Date().toISOString()
  };

  if (processedRecords !== undefined) {
    updatedBatch.processed_records = processedRecords;
  }

  mockValidationBatches[idx] = updatedBatch;
  return updatedBatch;
}

// --- Get Batch Statistics ---
export async function getBatchStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  totalRecords: number;
  processedRecords: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const total = mockValidationBatches.length;
  const byStatus: Record<string, number> = {};
  let totalRecords = 0;
  let processedRecords = 0;

  mockValidationBatches.forEach(batch => {
    byStatus[batch.status] = (byStatus[batch.status] || 0) + 1;
    totalRecords += batch.total_records;
    processedRecords += batch.processed_records;
  });

  return {
    total,
    byStatus,
    totalRecords,
    processedRecords
  };
}