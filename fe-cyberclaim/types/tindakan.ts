// types/tindakan.ts
export interface Tindakan {
    id: string;
    code: string;
    description: string;
    category?: string;
    price?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface TindakanFormData {
    code: string;
    description: string;
    category?: string;
    price?: number;
    is_active: boolean;
  }
  
  export interface TindakanQuery {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_active?: boolean;
  }
  
  export interface TindakanResponse {
    data: Tindakan[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }