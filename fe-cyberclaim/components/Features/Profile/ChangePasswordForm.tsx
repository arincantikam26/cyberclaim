// components/profile/ChangePasswordForm.tsx
'use client';

import { useState } from 'react';

interface ChangePasswordFormProps {
  onSubmit: (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => void;
  loading: boolean;
}

export default function ChangePasswordForm({ onSubmit, loading }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    if (!formData.current_password.trim()) {
      newErrors.current_password = 'Password saat ini wajib diisi';
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = 'Password baru wajib diisi';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password minimal 6 karakter';
    }

    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = 'Konfirmasi password wajib diisi';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password tidak sesuai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900">Ubah Password</h2>
        <p className="text-gray-600 mt-1">Perbarui password akun Anda untuk keamanan</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${
                  errors.current_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${
                  errors.new_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan password baru (min. 6 karakter)"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-2 text-sm text-red-600">{errors.new_password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Konfirmasi password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-2 text-sm text-red-600">{errors.confirm_password}</p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Persyaratan Password</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Minimal 6 karakter</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Gunakan kombinasi huruf dan angka</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Hindari password yang mudah ditebak</span>
            </li>
          </ul>
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
                Mengubah Password...
              </>
            ) : (
              <>
                <KeyIcon className="w-5 h-5 mr-2" />
                Ubah Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Icon Components for ChangePasswordForm
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const KeyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);