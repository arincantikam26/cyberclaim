// components/features/doctors/DoctorForm.tsx
'use client';

import { BaseForm } from '@/components/UI/Forms/BaseForms';
import { FormField } from '@/components/UI/Forms/FormField';
import { Input } from '@/components/UI/Forms/Input';
import { Select } from '@/components/UI/Forms/Select';
import { Textarea } from '@/components/UI/Forms/TextArea';
import { useForm } from '@/hooks/useForm';
import { DoctorFormData } from '@/types/doctor';
import { Faskes } from '@/types/faskes';

interface DoctorFormProps {
  initialData?: Partial<DoctorFormData>;
  faskesList: Faskes[];
  onSubmit: (data: DoctorFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const initialValues: DoctorFormData = {
  facility_id: '',
  name: '',
  specialization: '',
  bpjs_id: '',
  birth_date: '',
  gender: 'L',
  telp: '',
  address: '',
  is_active: true
};

const genderOptions = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

const specializationOptions = [
  { value: 'Umum', label: 'Dokter Umum' },
  { value: 'Spesialis Jantung', label: 'Spesialis Jantung' },
  { value: 'Spesialis Penyakit Dalam', label: 'Spesialis Penyakit Dalam' },
  { value: 'Spesialis Bedah', label: 'Spesialis Bedah' },
  { value: 'Spesialis Anak', label: 'Spesialis Anak' },
  { value: 'Spesialis Kandungan', label: 'Spesialis Kandungan' },
  { value: 'Spesialis Kulit', label: 'Spesialis Kulit' },
  { value: 'Spesialis Mata', label: 'Spesialis Mata' },
  { value: 'Spesialis THT', label: 'Spesialis THT' },
  { value: 'Spesialis Saraf', label: 'Spesialis Saraf' },
  { value: 'Spesialis Jiwa', label: 'Spesialis Jiwa' },
  { value: 'Spesialis Radiologi', label: 'Spesialis Radiologi' },
];

export function DoctorForm({
  initialData = {},
  faskesList,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create'
}: DoctorFormProps) {
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
      
      if (!values.facility_id) {
        errors.facility_id = 'Faskes wajib dipilih';
      }
      
      if (!values.name.trim()) {
        errors.name = 'Nama dokter wajib diisi';
      }
      
      if (!values.specialization) {
        errors.specialization = 'Spesialisasi wajib dipilih';
      }
      
      if (!values.bpjs_id.trim()) {
        errors.bpjs_id = 'ID BPJS wajib diisi';
      } else if (!/^\d+$/.test(values.bpjs_id)) {
        errors.bpjs_id = 'ID BPJS harus berupa angka';
      }
      
      if (!values.birth_date) {
        errors.birth_date = 'Tanggal lahir wajib diisi';
      } else {
        const birthDate = new Date(values.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 23) {
          errors.birth_date = 'Dokter harus berusia minimal 23 tahun';
        }
      }
      
      if (!values.gender) {
        errors.gender = 'Jenis kelamin wajib dipilih';
      }
      
      if (!values.telp.trim()) {
        errors.telp = 'Nomor telepon wajib diisi';
      }
      
      if (!values.address.trim()) {
        errors.address = 'Alamat wajib diisi';
      }
      
      return errors;
    }
  });

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel={mode === 'create' ? 'Buat Dokter' : 'Update Dokter'}
      className="max-w-4xl"
    >
      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Dasar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Faskes"
            name="facility_id"
            required
            error={errors.facility_id}
          >
            <Select
              name="facility_id"
              value={values.facility_id}
              onChange={(e) => handleChange('facility_id', e.target.value)}
              onBlur={() => handleBlur('facility_id')}
              options={faskesList.map(faskes => ({
                value: faskes.id!,
                label: `${faskes.name} (${faskes.code})`
              }))}
              placeholder="Pilih faskes"
              error={errors.facility_id}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Nama Dokter"
            name="name"
            required
            error={errors.name}
          >
            <Input
              name="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Dr. John Doe, Sp.JP"
              error={errors.name}
              disabled={loading}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            label="Spesialisasi"
            name="specialization"
            required
            error={errors.specialization}
          >
            <Select
              name="specialization"
              value={values.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              onBlur={() => handleBlur('specialization')}
              options={specializationOptions}
              placeholder="Pilih spesialisasi"
              error={errors.specialization}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="ID BPJS"
            name="bpjs_id"
            required
            error={errors.bpjs_id}
            helpText="Nomor identifikasi BPJS dokter"
          >
            <Input
              name="bpjs_id"
              value={values.bpjs_id}
              onChange={(e) => handleChange('bpjs_id', e.target.value)}
              onBlur={() => handleBlur('bpjs_id')}
              placeholder="123456789"
              error={errors.bpjs_id}
              disabled={loading}
            />
          </FormField>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Pribadi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Tanggal Lahir"
            name="birth_date"
            required
            error={errors.birth_date}
          >
            <Input
              name="birth_date"
              type="date"
              value={formatDateForInput(values.birth_date)}
              onChange={(e) => handleChange('birth_date', e.target.value)}
              onBlur={() => handleBlur('birth_date')}
              error={errors.birth_date}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Jenis Kelamin"
            name="gender"
            required
            error={errors.gender}
          >
            <Select
              name="gender"
              value={values.gender}
              onChange={(e) => handleChange('gender', e.target.value as 'L' | 'P')}
              onBlur={() => handleBlur('gender')}
              options={genderOptions}
              placeholder="Pilih jenis kelamin"
              error={errors.gender}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Status Aktif"
            name="is_active"
          >
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_active"
                  value="true"
                  checked={values.is_active === true}
                  onChange={() => handleChange('is_active', true)}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_active"
                  value="false"
                  checked={values.is_active === false}
                  onChange={() => handleChange('is_active', false)}
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
        
        <div className="grid grid-cols-1 gap-6">
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
            label="Alamat"
            name="address"
            required
            error={errors.address}
          >
            <Textarea
              name="address"
              value={values.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Masukkan alamat lengkap dokter"
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