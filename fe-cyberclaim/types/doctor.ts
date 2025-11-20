// types/doctor.ts
export interface Doctor {
    id?: string;
    facility_id: string;
    name: string;
    specialization: string;
    bpjs_id: string;
    birth_date: string;
    gender: 'L' | 'P';
    telp: string;
    address: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    facility_name?: string; // Joined field
  }
  
  export interface DoctorFormData {
    facility_id: string;
    name: string;
    specialization: string;
    bpjs_id: string;
    birth_date: string;
    gender: 'L' | 'P';
    telp: string;
    address: string;
    is_active: boolean;
  }