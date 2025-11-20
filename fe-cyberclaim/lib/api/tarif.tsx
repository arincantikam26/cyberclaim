// lib/api/tarif.ts
import { InacbgsTarif, InacbgsQuery, InacbgsResponse } from '@/types/inacbgs';
import { mockInacbgs } from '@/lib/mock-data/mockInacbgs';

export const getTarifInacbgs = async (query: InacbgsQuery = {}): Promise<InacbgsResponse> => {
  const { page = 1, limit = 8, search = '', kelas_rawat } = query;
  
  // Simulasi delay API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredData = [...mockInacbgs];
  
  // Apply search filter
  if (search) {
    filteredData = filteredData.filter(item =>
      item.kode_cbg.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_cbg.toLowerCase().includes(search.toLowerCase()) ||
      item.komponen_tarif.diagnosis.some(d => 
        d.kode_icd10.toLowerCase().includes(search.toLowerCase()) ||
        d.deskripsi.toLowerCase().includes(search.toLowerCase())
      ) ||
      item.komponen_tarif.tindakan.some(t =>
        t.kode_icd9.toLowerCase().includes(search.toLowerCase()) ||
        t.deskripsi.toLowerCase().includes(search.toLowerCase())
      )
    );
  }
  
  // Apply kelas filter
  if (kelas_rawat && kelas_rawat !== 'all') {
    filteredData = filteredData.filter(item => item.kelas_rawat === kelas_rawat);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedData,
    page,
    limit,
    total: filteredData.length,
    totalPages: Math.ceil(filteredData.length / limit)
  };
};

export const getTarifStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const total = mockInacbgs.length;
  const rendah = mockInacbgs.filter(item => item.kelas_rawat === 'Rendah').length;
  const sedang = mockInacbgs.filter(item => item.kelas_rawat === 'Sedang').length;
  const tinggi = mockInacbgs.filter(item => item.kelas_rawat === 'Tinggi').length;
  const special = mockInacbgs.filter(item => item.kelas_rawat === 'Special').length;
  const total_tarif = mockInacbgs.reduce((sum, item) => sum + item.tarif, 0);
  
  return {
    total,
    rendah,
    sedang,
    tinggi,
    special,
    total_tarif
  };
};

export const getTarifDetail = async (id: string): Promise<InacbgsTarif | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const tarif = mockInacbgs.find(item => item.id === id);
  return tarif || null;
};