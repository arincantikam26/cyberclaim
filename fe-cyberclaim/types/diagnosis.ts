// types/diagnosis.ts
export interface Diagnosis {
    id: string;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface DiagnosisFormData {
    code: string;
    description: string;
  }
  
  export interface DiagnosisQuery {
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface DiagnosisResponse {
    data: Diagnosis[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }