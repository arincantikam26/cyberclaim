// components/patients/PatientForm.tsx (Enhanced Version)
'use client';

import { useState, useEffect } from 'react';
import { Patient, MembershipInfo } from '@/types/patient';

interface PatientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  mode: 'create' | 'edit';
  initialData?: Patient | null;
}

export function PatientForm({ 
  onSubmit, 
  onCancel, 
  loading, 
  mode = 'create',
  initialData
}: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    gender: 'L' as 'L' | 'P',
    telp: '',
    address: '',
    nik: '',
    bpjs_number: '',
    membership_type: '',
    membership_tier: '',
    membership_number: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      let membership: MembershipInfo | null = null;
      
      if (initialData.membership_json) {
        try {
          membership = JSON.parse(initialData.membership_json);
        } catch (error) {
          console.error('Error parsing membership JSON:', error);
        }
      }

      setFormData({
        name: initialData.name || '',
        birth_date: initialData.birth_date ? formatDateForInput(initialData.birth_date) : '',
        gender: initialData.gender || 'L',
        telp: initialData.telp || '',
        address: initialData.address || '',
        nik: initialData.nik || '',
        bpjs_number: initialData.bpjs_number || '',
        membership_type: membership?.type || '',
        membership_tier: membership?.tier || '',
        membership_number: membership?.number || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [mode, initialData]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Nama pasien wajib diisi';
    }

    if (!formData.birth_date) {
      newErrors.birth_date = 'Tanggal lahir wajib diisi';
    }

    if (!formData.telp.trim()) {
      newErrors.telp = 'Nomor telepon wajib diisi';
    } else if (!/^[\d+\-\s()]+$/.test(formData.telp)) {
      newErrors.telp = 'Format nomor telepon tidak valid';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik.replace(/\s/g, ''))) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }

    if (formData.bpjs_number && !/^\d+$/.test(formData.bpjs_number.replace(/\s/g, ''))) {
      newErrors.bpjs_number = 'Nomor BPJS harus berupa angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare membership JSON
      const membershipJson = formData.membership_type ? JSON.stringify({
        type: formData.membership_type,
        tier: formData.membership_tier,
        number: formData.membership_number
      }) : '';

      const submitData = {
        ...formData,
        membership_json: membershipJson
      };

      onSubmit(submitData);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Pribadi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap pasien"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* NIK */}
          <div>
            <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-2">
              NIK <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nik"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nik ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan 16 digit NIK"
              disabled={loading}
              maxLength={16}
            />
            {errors.nik && (
              <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Birth Date */}
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.birth_date ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {formData.birth_date && (
              <p className="mt-1 text-sm text-gray-500">
                Usia: {calculateAge(formData.birth_date)} tahun
              </p>
            )}
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
            )}
          </div>

          {/* Phone Number */}
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
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.telp ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 081234567890"
              disabled={loading}
            />
            {errors.telp && (
              <p className="mt-1 text-sm text-red-600">{errors.telp}</p>
            )}
          </div>

          {/* BPJS Number */}
          <div>
            <label htmlFor="bpjs_number" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor BPJS
            </label>
            <input
              type="text"
              id="bpjs_number"
              name="bpjs_number"
              value={formData.bpjs_number}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bpjs_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nomor BPJS"
              disabled={loading}
            />
            {errors.bpjs_number && (
              <p className="mt-1 text-sm text-red-600">{errors.bpjs_number}</p>
            )}
          </div>
        </div>
      </div>

      {/* Membership Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Membership
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Membership Type */}
          <div>
            <label htmlFor="membership_type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Membership
            </label>
            <select
              id="membership_type"
              name="membership_type"
              value={formData.membership_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Pilih Tipe</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Membership Tier */}
          <div>
            <label htmlFor="membership_tier" className="block text-sm font-medium text-gray-700 mb-2">
              Tier Membership
            </label>
            <select
              id="membership_tier"
              name="membership_tier"
              value={formData.membership_tier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Pilih Tier</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          {/* Membership Number */}
          <div>
            <label htmlFor="membership_number" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Membership
            </label>
            <input
              type="text"
              id="membership_number"
              name="membership_number"
              value={formData.membership_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nomor membership"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alamat
        </h3>
        
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
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan alamat lengkap"
            disabled={loading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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
            Pasien aktif
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Jika tidak dicentang, pasien akan ditandai sebagai tidak aktif
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
            mode === 'create' ? 'Simpan Pasien' : 'Update Pasien'
          )}
        </button>
      </div>
    </form>
  );
}