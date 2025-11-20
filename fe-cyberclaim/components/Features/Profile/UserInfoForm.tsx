// components/profile/UserInfoForm.tsx
'use client';

import { useState } from 'react';
import { User } from '@/types/user';

interface UserInfoFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => void;
  loading: boolean;
}

export default function UserInfoForm({ user, onSubmit, loading }: UserInfoFormProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900">Informasi User</h2>
        <p className="text-gray-600 mt-1">Kelola informasi akun user Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username (Read-only) */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
            <p className="mt-2 text-sm text-gray-500">Username tidak dapat diubah</p>
          </div>

          {/* Role (Read-only) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              id="role"
              value={user.role_id === 'role-1' ? 'Administrator' : 'User'}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
            <p className="mt-2 text-sm text-gray-500">Role tidak dapat diubah</p>
          </div>

          {/* Full Name */}
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.full_name && (
              <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="nama@email.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Status Info */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Status: {user.is_active ? 'Aktif' : 'Nonaktif'}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {user.is_active 
                  ? 'Akun Anda saat ini aktif dan dapat digunakan' 
                  : 'Akun Anda saat ini nonaktif'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="mt-3 sm:mt-0 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5 mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);