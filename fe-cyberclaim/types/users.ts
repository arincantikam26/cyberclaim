// types/user.ts
export interface User {
  id: string;
  facility_id: string;
  username: string;
  password: string;
  full_name: string;
  email: string;
  role_id: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  facility_id: string;
  username: string;
  password: string;
  full_name: string;
  email: string;
  role_id: string;
  is_active: boolean;
}

export interface LoginHistory {
  id: string;
  user_id: string;
  login_at: string;
  ip_address: string;
  user_agent: string;
}

// types/validation.ts
export interface ValidationBatch {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number;
  processed_records: number;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  id: string;
  batch_id: string;
  validation_type: string;
  status: 'valid' | 'invalid' | 'warning';
  details: string;
  resolved_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
  warning: number;
  resolved: number;
}

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