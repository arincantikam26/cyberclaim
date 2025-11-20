// components/users/UserForm.tsx (Enhanced)
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/users';

// Mock data untuk facilities dan roles
const mockFacilities = [
  { id: 'faskes-1', name: 'Klinik Utama Jakarta' },
  { id: 'faskes-2', name: 'Klinik Cabang Bandung' },
  { id: 'faskes-3', name: 'Klinik Cabang Surabaya' }
];

const mockRoles = [
  { id: 'role-1', name: 'Administrator' },
  { id: 'role-2', name: 'Dokter' },
  { id: 'role-3', name: 'Perawat' },
  { id: 'role-4', name: 'Front Desk' },
  { id: 'role-5', name: 'Staff Administrasi' }
];

interface UserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  mode: 'create' | 'edit';
  initialData?: User | null;
}

export function UserForm({ 
  onSubmit, 
  onCancel, 
  loading, 
  mode = 'create',
  initialData
}: UserFormProps) {
  const [formData, setFormData] = useState({
    facility_id: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    email: '',
    role_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        facility_id: initialData.facility_id || '',
        username: initialData.username || '',
        password: '', // Password tidak diisi untuk edit
        confirmPassword: '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        role_id: initialData.role_id || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [mode, initialData]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);



  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Lemah';
    if (passwordStrength <= 3) return 'Sedang';
    return 'Kuat';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.facility_id) {
      newErrors.facility_id = 'Fasilitas kesehatan wajib dipilih';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh mengandung huruf, angka, titik, dash, dan underscore';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (mode === 'create' && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (mode === 'create' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Role wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Hapus confirmPassword sebelum submit
      const { confirmPassword, ...submitData } = formData;
      
      // Jika mode edit dan password kosong, hapus field password
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Facility and Role Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Fasilitas dan Role
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facility */}
          <div>
            <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700 mb-2">
              Fasilitas Kesehatan <span className="text-red-500">*</span>
            </label>
            <select
              id="facility_id"
              name="facility_id"
              value={formData.facility_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.facility_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Pilih Fasilitas</option>
              {mockFacilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
            {errors.facility_id && (
              <p className="mt-1 text-sm text-red-600">{errors.facility_id}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.role_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Pilih Role</option>
              {mockRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Akun
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan username"
              disabled={loading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password {mode === 'create' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={mode === 'create' ? 'Masukkan password' : 'Kosongkan jika tidak ingin mengubah'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'create' && formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Kekuatan password:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-600' : 
                    passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            {mode === 'edit' && (
              <p className="mt-1 text-sm text-gray-500">
                Kosongkan jika tidak ingin mengubah password
              </p>
            )}
          </div>

          {/* Confirm Password */}
          {mode === 'create' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Konfirmasi password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Pribadi
        </h3>
        
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama lengkap"
            disabled={loading}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Status
        </h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
            User aktif
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Jika tidak dicentang, user tidak dapat login ke sistem
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="mt-3 sm:mt-0 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'create' ? 'Menyimpan...' : 'Mengupdate...'}
            </>
          ) : (
            mode === 'create' ? 'Simpan User' : 'Update User'
          )}
        </button>
      </div>
    </form>
  );
}

// Icon Components
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);