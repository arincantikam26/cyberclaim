// types/auth.ts
export interface LoginFormData {
    username: string;
    password: string;
    remember_me?: boolean;
  }
  
  export interface RegisterFormData {
    facility_code: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    phone: string;
    agree_terms: boolean;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      user: {
        id: string;
        username: string;
        email: string;
        full_name: string;
        role: string;
        facility_id: string;
      };
      token: string;
      expires_in: number;
    };
  }

  // types/auth.ts (add to existing)
export interface LogoutResponse {
    success: boolean;
    message: string;
  }
  
  export interface UserSession {
    user: {
      id: string;
      username: string;
      email: string;
      full_name: string;
      role: string;
      facility_id: string;
      last_login?: string;
    };
    token: string;
    expires_in: number;
  }