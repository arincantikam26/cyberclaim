// types/inacbgs.ts
export interface InacbgsTarif {
    id: string;
    kode_cbg: string;
    nama_cbg: string;
    kelas_rawat: 'Rendah' | 'Sedang' | 'Tinggi' | 'Special';
    tarif: number;
    komponen_tarif: {
      diagnosis: Array<{
        kode_icd10: string;
        deskripsi: string;
        tarif: number;
      }>;
      tindakan: Array<{
        kode_icd9: string;
        deskripsi: string;
        tarif: number;
      }>;
    };
    created_at: string;
    updated_at: string;
  }
  
  export interface InacbgsQuery {
    page?: number;
    limit?: number;
    search?: string;
    kelas_rawat?: string;
  }
  
  export interface InacbgsResponse {
    data: InacbgsTarif[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }