// types/patient.ts
export interface Patient {
  id: string;
  name: string;
  birth_date: string;
  gender: 'L' | 'P';
  telp: string;
  address: string;
  nik: string;
  bpjs_number: string;
  membership_json: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  name: string;
  birth_date: string;
  gender: 'L' | 'P';
  telp: string;
  address: string;
  nik: string;
  bpjs_number: string;
  membership_json: string;
  is_active: boolean;
}

export interface MembershipInfo {
  type: 'Basic' | 'Standard' | 'Premium';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  number: string;
  start_date?: string;
  end_date?: string;
}