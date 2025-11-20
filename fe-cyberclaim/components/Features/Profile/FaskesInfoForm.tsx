// components/profile/FaskesInfoForm.tsx
'use client';

import { useState } from 'react';
import { Faskes, FaskesFormData } from '@/types/faskes';

interface FaskesInfoFormProps {
  faskes: Faskes;
  onSubmit: (data: FaskesFormData) => void;
  loading: boolean;
}

export default function FaskesInfoForm({ faskes, onSubmit, loading }: FaskesInfoFormProps) {
  const [formData, setFormData] = useState<FaskesFormData>({
    code: faskes.code,
    name: faskes.name,
    telp: faskes.telp,
    website: faskes.website,
    address: faskes.address,
    province: faskes.province,
    city: faskes.city,
    jenis_sarana_id: faskes.jenis_sarana_id,
    operasional: faskes.operasional
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.code.trim()) {
      newErrors.code = 'Kode faskes wajib diisi';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nama faskes wajib diisi';
    }

    if (!formData.telp.trim()) {
      newErrors.telp = 'Nomor telepon wajib diisi';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'Provinsi wajib diisi';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
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
        <h2 className="text-xl font-semibold text-gray-900">Data Fasilitas Kesehatan</h2>
        <p className="text-gray-600 mt-1">Kelola informasi fasilitas kesehatan Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kode Faskes */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Kode Faskes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan kode faskes"
            />
            {errors.code && (
              <p className="mt-2 text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          {/* Nama Faskes */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Faskes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama faskes"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <label htmlFor="telp" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="telp"
              name="telp"
              value={formData.telp}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.telp ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: (021) 1234567"
            />
            {errors.telp && (
              <p className="mt-2 text-sm text-red-600">{errors.telp}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com"
            />
          </div>

          {/* Provinsi */}
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan provinsi"
            />
            {errors.province && (
              <p className="mt-2 text-sm text-red-600">{errors.province}</p>
            )}
          </div>

          {/* Kota */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan kota"
            />
            {errors.city && (
              <p className="mt-2 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan alamat lengkap faskes"
          />
          {errors.address && (
            <p className="mt-2 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Status Operasional */}
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <input
            type="checkbox"
            id="operasional"
            name="operasional"
            checked={formData.operasional}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="operasional" className="text-sm font-medium text-gray-700">
            Faskes sedang beroperasi
          </label>
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