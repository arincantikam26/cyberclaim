// components/diagnosis/DiagnosisForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tindakan } from '@/types/tindakan';

interface TindakanFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  mode: 'create' | 'edit';
  initialData?: Tindakan | null;
}

export default function TindakanForm({ 
  onSubmit, 
  onCancel, 
  loading, 
  mode = 'create',
  initialData
}: TindakanFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        code: initialData.code || '',
        description: initialData.description || ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.code.trim()) {
      newErrors.code = 'Kode tindakan wajib diisi';
    } else if (!/^[0-9A-Za-z.\-]+$/.test(formData.code)) {
      newErrors.code = 'Kode hanya boleh mengandung angka, huruf, titik, dan dash';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi tindakan wajib diisi';
    } else if (formData.description.length < 5) {
      newErrors.description = 'Deskripsi minimal 5 karakter';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Kode Tindakan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Kode ICD-10 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 001.9, 250.00"
              disabled={loading}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Format kode diagnosis ICD-10 (contoh: 001.9, 250.00, 401.9)
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Deskripsi Tindakan
        </h3>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan deskripsi lengkap diagnosis..."
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Deskripsi harus jelas dan sesuai dengan standar ICD-10
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Contoh Kode ICD-10:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div>• 001.9 - Cholera, unspecified</div>
          <div>• 250.00 - Diabetes mellitus</div>
          <div>• 401.9 - Hypertension</div>
          <div>• 466.0 - Acute bronchitis</div>
        </div>
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
            mode === 'create' ? 'Simpan Diagnosis' : 'Update Diagnosis'
          )}
        </button>
      </div>
    </form>
  );
}