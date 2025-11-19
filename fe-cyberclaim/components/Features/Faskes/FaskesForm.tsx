// components/features/faskes/FaskesForm.tsx
'use client';

import { BaseForm } from '@/components/UI/Forms/BaseForms';
import { FormField } from '@/components/UI/Forms/FormField';
import { Input } from '@/components/UI/Forms/Input';
import { Select } from '@/components/UI/Forms/Select';
import { Textarea } from '@/components/UI/Forms/TextArea';
import { useForm } from '@/hooks/useForm';
import { FaskesFormData } from '@/types/faskes';

interface FaskesFormProps {
  initialData?: Partial<FaskesFormData>;
  onSubmit: (data: FaskesFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const initialValues: FaskesFormData = {
  code: '',
  name: '',
  telp: '',
  website: '',
  address: '',
  province: '',
  city: '',
  jenis_sarana_id: 1,
  operasional: true
};

const provinceOptions = [
  { value: 'DKI Jakarta', label: 'DKI Jakarta' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Jawa Tengah', label: 'Jawa Tengah' },
  { value: 'Jawa Timur', label: 'Jawa Timur' },
  { value: 'Banten', label: 'Banten' },
  { value: 'DIY Yogyakarta', label: 'DIY Yogyakarta' },
];

const jenisSaranaOptions = [
  { value: 1, label: 'Rumah Sakit' },
  { value: 2, label: 'Klinik' },
  { value: 3, label: 'Puskesmas' },
  { value: 4, label: 'Laboratorium' },
  { value: 5, label: 'Apotek' },
];

export function FaskesForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create'
}: FaskesFormProps) {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({
    initialValues: { ...initialValues, ...initialData },
    onSubmit,
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (!values.code.trim()) {
        errors.code = 'Kode Faskes wajib diisi';
      } else if (!/^[A-Z0-9-]+$/.test(values.code)) {
        errors.code = 'Kode hanya boleh mengandung huruf kapital, angka, dan dash';
      }
      
      if (!values.name.trim()) {
        errors.name = 'Nama Faskes wajib diisi';
      }
      
      if (!values.telp.trim()) {
        errors.telp = 'Nomor telepon wajib diisi';
      }
      
      if (!values.address.trim()) {
        errors.address = 'Alamat wajib diisi';
      }
      
      if (!values.province) {
        errors.province = 'Provinsi wajib dipilih';
      }
      
      if (!values.city.trim()) {
        errors.city = 'Kota wajib diisi';
      }
      
      if (!values.jenis_sarana_id) {
        errors.jenis_sarana_id = 'Jenis sarana wajib dipilih';
      }

      // Website validation (optional but must be valid if provided)
      if (values.website && !isValidUrl(values.website)) {
        errors.website = 'Format website tidak valid';
      }

      return errors;
    }
  });

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel={mode === 'create' ? 'Buat Faskes' : 'Update Faskes'}
      className="max-w-4xl"
    >
      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Dasar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Kode Faskes"
            name="code"
            required
            error={errors.code}
            helpText="Kode unik faskes (contoh: RSUD-JKT-001)"
          >
            <Input
              name="code"
              value={values.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('code')}
              placeholder="RSUD-JKT-001"
              error={errors.code}
              disabled={loading || mode === 'edit'} // Code tidak bisa diubah saat edit
            />
          </FormField>

          <FormField
            label="Nama Faskes"
            name="name"
            required
            error={errors.name}
          >
            <Input
              name="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="RSUD Budi Mulia"
              error={errors.name}
              disabled={loading}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            label="Jenis Sarana"
            name="jenis_sarana_id"
            required
            error={errors.jenis_sarana_id}
          >
            <Select
              name="jenis_sarana_id"
              value={values.jenis_sarana_id.toString()}
              onChange={(e) => handleChange('jenis_sarana_id', parseInt(e.target.value))}
              onBlur={() => handleBlur('jenis_sarana_id')}
              options={jenisSaranaOptions}
              placeholder="Pilih jenis sarana"
              error={errors.jenis_sarana_id}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Status Operasional"
            name="operasional"
          >
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operasional"
                  value="true"
                  checked={values.operasional === true}
                  onChange={() => handleChange('operasional', true)}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operasional"
                  value="false"
                  checked={values.operasional === false}
                  onChange={() => handleChange('operasional', false)}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Tidak Aktif</span>
              </label>
            </div>
          </FormField>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Kontak
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nomor Telepon"
            name="telp"
            required
            error={errors.telp}
          >
            <Input
              name="telp"
              value={values.telp}
              onChange={(e) => handleChange('telp', e.target.value)}
              onBlur={() => handleBlur('telp')}
              placeholder="(021) 1234567"
              error={errors.telp}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Website"
            name="website"
            error={errors.website}
            helpText="Opsional - contoh: https://example.com"
          >
            <Input
              name="website"
              value={values.website}
              onChange={(e) => handleChange('website', e.target.value)}
              onBlur={() => handleBlur('website')}
              placeholder="https://rsudbudimulia.jakarta.go.id"
              error={errors.website}
              disabled={loading}
            />
          </FormField>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Alamat
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Provinsi"
            name="province"
            required
            error={errors.province}
          >
            <Select
              name="province"
              value={values.province}
              onChange={(e) => handleChange('province', e.target.value)}
              onBlur={() => handleBlur('province')}
              options={provinceOptions}
              placeholder="Pilih provinsi"
              error={errors.province}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Kota"
            name="city"
            required
            error={errors.city}
          >
            <Input
              name="city"
              value={values.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              placeholder="Jakarta Pusat"
              error={errors.city}
              disabled={loading}
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField
            label="Alamat Lengkap"
            name="address"
            required
            error={errors.address}
          >
            <Textarea
              name="address"
              value={values.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Jl. Kesehatan Raya No. 123"
              rows={3}
              error={errors.address}
              disabled={loading}
            />
          </FormField>
        </div>
      </div>
    </BaseForm>
  );
}