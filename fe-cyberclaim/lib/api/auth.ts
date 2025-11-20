// lib/api/auth.ts
import { LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';

// Simulasi API calls
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  // Simulasi delay API
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Demo credentials
  if (data.username === 'admin' && data.password === '123456') {
    return {
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@klinik.com',
          full_name: 'Administrator System',
          role: 'admin',
          facility_id: '1'
        },
        token: 'demo_token_123456',
        expires_in: 3600
      }
    };
  }

  return {
    success: false,
    message: 'Username atau password salah'
  };
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulasi validasi kode faskes
  if (data.facility_code === 'RSUD-JKT-001') {
    return {
      success: false,
      message: 'Kode faskes sudah terdaftar'
    };
  }

  return {
    success: true,
    message: 'Pendaftaran berhasil. Akun Anda sedang diverifikasi.',
    data: {
      user: {
        id: '2',
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        role: 'user',
        facility_id: '2'
      },
      token: 'demo_token_789012',
      expires_in: 3600
    }
  };
};

export const logout = async (): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};