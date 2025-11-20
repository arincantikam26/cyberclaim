// lib/api/tindakan.ts
import { Tindakan, TindakanFormData, TindakanResponse } from '@/types/tindakan';
import { mockTindakan } from '@/lib/mock-data/tindakan';

// --- Get Tindakan With Pagination ---
export async function getTindakan(query?: any): Promise<TindakanResponse> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const page = query?.page ?? 1;
  const limit = query?.limit ?? 10;
  const search = query?.search?.toLowerCase() || '';
  const category = query?.category;
  const is_active = query?.is_active;

  // Filter tindakan based on search and filters
  let filteredTindakan = mockTindakan;

  if (search) {
    filteredTindakan = filteredTindakan.filter(tindakan =>
      tindakan.code.toLowerCase().includes(search) ||
      tindakan.description.toLowerCase().includes(search) ||
      tindakan.category?.toLowerCase().includes(search)
    );
  }

  if (category) {
    filteredTindakan = filteredTindakan.filter(tindakan => tindakan.category === category);
  }

  if (typeof is_active === 'boolean') {
    filteredTindakan = filteredTindakan.filter(tindakan => tindakan.is_active === is_active);
  }

  // Sort by code
  filteredTindakan.sort((a, b) => a.code.localeCompare(b.code));

  const total = filteredTindakan.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filteredTindakan.slice(start, end);

  return {
    data: paginated,
    page,
    limit,
    total,
    totalPages
  };
}

// --- Get Single Tindakan ---
export async function getTindakanById(id: string): Promise<Tindakan> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const tindakan = mockTindakan.find(t => t.id === id);
  if (!tindakan) throw new Error('Tindakan not found');

  return tindakan;
}

// --- Create Tindakan ---
export async function createTindakan(data: TindakanFormData): Promise<Tindakan> {
  await new Promise(resolve => setTimeout(resolve, 600));

  // Validation
  if (!data.code || !data.description) {
    throw new Error('Code and description are required');
  }

  // Check for duplicate code
  const existingTindakan = mockTindakan.find(t => t.code === data.code);
  if (existingTindakan) {
    throw new Error('Tindakan code already exists');
  }

  const newTindakan: Tindakan = {
    ...data,
    id: (mockTindakan.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockTindakan.unshift(newTindakan);
  return newTindakan;
}

// --- Update Tindakan ---
export async function updateTindakan(id: string, data: TindakanFormData): Promise<Tindakan> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const idx = mockTindakan.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Tindakan not found');

  // Check for duplicate code (excluding current)
  const existingCode = mockTindakan.find(
    t => t.code === data.code && t.id !== id
  );
  if (existingCode) {
    throw new Error('Tindakan code already exists');
  }

  mockTindakan[idx] = {
    ...mockTindakan[idx],
    ...data,
    updated_at: new Date().toISOString()
  };

  return mockTindakan[idx];
}

// --- Delete Tindakan ---
export async function deleteTindakan(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const idx = mockTindakan.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Tindakan not found');

  mockTindakan.splice(idx, 1);
}

// --- Toggle Tindakan Status ---
export async function toggleTindakanStatus(id: string): Promise<Tindakan> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const idx = mockTindakan.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Tindakan not found');

  const updatedTindakan: Tindakan = {
    ...mockTindakan[idx],
    is_active: !mockTindakan[idx].is_active,
    updated_at: new Date().toISOString()
  };

  mockTindakan[idx] = updatedTindakan;
  return updatedTindakan;
}

// --- Get Tindakan Categories ---
export async function getTindakanCategories(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const categories = [...new Set(mockTindakan.map(t => t.category).filter(Boolean))] as string[];
  return categories.sort();
}

// --- Get Tindakan Stats ---
export async function getTindakanStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  byCategory: Record<string, number>;
}> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const total = mockTindakan.length;
  const active = mockTindakan.filter(t => t.is_active).length;
  const inactive = mockTindakan.filter(t => !t.is_active).length;

  const byCategory: Record<string, number> = {};
  mockTindakan.forEach(tindakan => {
    const category = tindakan.category || 'Uncategorized';
    byCategory[category] = (byCategory[category] || 0) + 1;
  });

  return {
    total,
    active,
    inactive,
    byCategory
  };
}

// --- Search Tindakan ---
export async function searchTindakan(term: string): Promise<Tindakan[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!term.trim()) {
    return mockTindakan.slice(0, 10);
  }

  const searchTerm = term.toLowerCase();
  return mockTindakan.filter(tindakan =>
    tindakan.code.toLowerCase().includes(searchTerm) ||
    tindakan.description.toLowerCase().includes(searchTerm) ||
    tindakan.category?.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
}