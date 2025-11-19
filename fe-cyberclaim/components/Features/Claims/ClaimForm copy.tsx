// components/features/claims/ClaimForm.tsx
'use client';

import { BaseForm } from '@/components/UI/Forms/BaseForms';
import { FormField } from '@/components/UI/Forms/FormField';
import { Input } from '@/components/UI/Forms/Input';
import { Select } from '@/components/UI/Forms/Select';
import { Textarea } from '@/components/UI/Forms/TextArea';
import { useForm } from '@/hooks/useForm';

interface ClaimFormData {
  patientName: string;
  bpjsNumber: string;
  diagnosis: string;
  procedure: string;
  amount: string;
  faskes: string;
  doctor: string;
  notes?: string;
}

interface ClaimFormProps {
  initialData?: Partial<ClaimFormData>;
  onSubmit: (data: ClaimFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const initialValues: ClaimFormData = {
  patientName: '',
  bpjsNumber: '',
  diagnosis: '',
  procedure: '',
  amount: '',
  faskes: '',
  doctor: '',
  notes: ''
};

const procedureOptions = [
  { value: '00.10', label: '00.10 - Injection of thrombolytic' },
  { value: '00.11', label: '00.11 - Other injection' },
  { value: '00.12', label: '00.12 - PTCA' },
  { value: '00.13', label: '00.13 - Appendectomy' },
  { value: '00.14', label: '00.14 - Osteosynthesis' },
];

const faskesOptions = [
  { value: 'rs-mitra-sehat', label: 'RS Mitra Sehat' },
  { value: 'rs-siloam', label: 'RS Siloam' },
  { value: 'klinik-sehat-sentosa', label: 'Klinik Sehat Sentosa' },
  { value: 'rs-premier', label: 'RS Premier' },
];

export function ClaimForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create'
}: ClaimFormProps) {
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
      
      if (!values.patientName.trim()) {
        errors.patientName = 'Nama pasien wajib diisi';
      }
      
      if (!values.bpjsNumber.trim()) {
        errors.bpjsNumber = 'Nomor BPJS wajib diisi';
      } else if (!/^\d{13}$/.test(values.bpjsNumber)) {
        errors.bpjsNumber = 'Nomor BPJS harus 13 digit';
      }
      
      if (!values.diagnosis.trim()) {
        errors.diagnosis = 'Diagnosis wajib diisi';
      }
      
      if (!values.procedure) {
        errors.procedure = 'Prosedur wajib dipilih';
      }
      
      if (!values.amount) {
        errors.amount = 'Nilai klaim wajib diisi';
      } else if (parseFloat(values.amount) <= 0) {
        errors.amount = 'Nilai klaim harus lebih dari 0';
      }
      
      if (!values.faskes) {
        errors.faskes = 'Faskes wajib dipilih';
      }
      
      if (!values.doctor.trim()) {
        errors.doctor = 'Nama dokter wajib diisi';
      }
      
      return errors;
    }
  });

  return (
    <BaseForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel={mode === 'create' ? 'Buat Klaim' : 'Update Klaim'}
      className="max-w-4xl"
    >
      {/* Patient Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Pasien
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nama Pasien"
            name="patientName"
            required
            error={errors.patientName}
          >
            <Input
              name="patientName"
              value={values.patientName}
              onChange={(e) => handleChange('patientName', e.target.value)}
              onBlur={() => handleBlur('patientName')}
              placeholder="Masukkan nama lengkap pasien"
              error={errors.patientName}
            />
          </FormField>

          <FormField
            label="Nomor BPJS"
            name="bpjsNumber"
            required
            error={errors.bpjsNumber}
            helpText="13 digit nomor BPJS"
          >
            <Input
              name="bpjsNumber"
              value={values.bpjsNumber}
              onChange={(e) => handleChange('bpjsNumber', e.target.value)}
              onBlur={() => handleBlur('bpjsNumber')}
              placeholder="0001234567890"
              maxLength={13}
              error={errors.bpjsNumber}
            />
          </FormField>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Medis
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <FormField
            label="Diagnosis"
            name="diagnosis"
            required
            error={errors.diagnosis}
          >
            <Input
              name="diagnosis"
              value={values.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              onBlur={() => handleBlur('diagnosis')}
              placeholder="Masukkan diagnosis utama"
              error={errors.diagnosis}
            />
          </FormField>

          <FormField
            label="Prosedur"
            name="procedure"
            required
            error={errors.procedure}
          >
            <Select
              name="procedure"
              value={values.procedure}
              onChange={(e) => handleChange('procedure', e.target.value)}
              onBlur={() => handleBlur('procedure')}
              options={procedureOptions}
              placeholder="Pilih prosedur"
              error={errors.procedure}
            />
          </FormField>

          <FormField
            label="Nama Dokter"
            name="doctor"
            required
            error={errors.doctor}
          >
            <Input
              name="doctor"
              value={values.doctor}
              onChange={(e) => handleChange('doctor', e.target.value)}
              onBlur={() => handleBlur('doctor')}
              placeholder="Masukkan nama dokter yang menangani"
              error={errors.doctor}
            />
          </FormField>
        </div>
      </div>

      {/* Claim Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Klaim
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Faskes"
            name="faskes"
            required
            error={errors.faskes}
          >
            <Select
              name="faskes"
              value={values.faskes}
              onChange={(e) => handleChange('faskes', e.target.value)}
              onBlur={() => handleBlur('faskes')}
              options={faskesOptions}
              placeholder="Pilih faskes"
              error={errors.faskes}
            />
          </FormField>

          <FormField
            label="Nilai Klaim (Rp)"
            name="amount"
            required
            error={errors.amount}
            helpText="Masukkan nilai tanpa titik"
          >
            <Input
              name="amount"
              type="number"
              value={values.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              placeholder="2500000"
              min="0"
              step="1000"
              error={errors.amount}
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField
            label="Catatan Tambahan"
            name="notes"
            helpText="Opsional - tambahkan catatan jika diperlukan"
          >
            <Textarea
              name="notes"
              value={values.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Tambahkan catatan atau informasi tambahan..."
              rows={4}
            />
          </FormField>
        </div>
      </div>
    </BaseForm>
  );
}