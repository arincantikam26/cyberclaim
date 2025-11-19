// types/faskes.ts
export interface Faskes {
    id?: string;
    code: string;
    name: string;
    telp: string;
    website: string;
    address: string;
    province: string;
    city: string;
    jenis_sarana_id: number;
    operasional: boolean;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FaskesFormData {
    code: string;
    name: string;
    telp: string;
    website: string;
    address: string;
    province: string;
    city: string;
    jenis_sarana_id: number;
    operasional: boolean;
  }