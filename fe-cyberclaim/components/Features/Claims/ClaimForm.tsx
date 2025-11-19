// components/features/claims/ClaimForm.tsx
'use client';

import { BaseForm } from '@/components/UI/Forms/BaseForms';
import { FormField } from '@/components/UI/Forms/FormField';
import { Input } from '@/components/UI/Forms/Input';
import { Select } from '@/components/UI/Forms/Select';
import { Textarea } from '@/components/UI/Forms/TextArea';
import { FileUpload } from '@/components/UI/Forms/FileUpload';
import { useForm } from '@/hooks/useForm';
import { useState } from 'react';

interface ClaimFormData {
  patientName: string;
  bpjsNumber: string;
  diagnosis: string;
  procedure: string;
  amount: string;
  faskes: string;
  doctor: string;
  notes?: string;
  claimFile?: File | null;
  existingFileName?: string; // Untuk edit mode
}

interface ClaimFormProps {
  initialData?: Partial<ClaimFormData>;
  onSubmit: (data: ClaimFormData & { claimFile?: File }) => Promise<void>;
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
  notes: '',
  claimFile: null
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
  const [fileError, setFileError] = useState<string>('');

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit: baseHandleSubmit,
    setValues
  } = useForm({
    initialValues: { ...initialValues, ...initialData },
    onSubmit: async (formValues) => {
      // File validation
      if (mode === 'create' && !formValues.claimFile) {
        setFileError('File klaim wajib diupload');
        return;
      }

      setFileError('');
      await onSubmit(formValues as ClaimFormData & { claimFile?: File });
    },
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

  const handleFileChange = (file: File | null) => {
    setValues(prev => ({ ...prev, claimFile: file }));
    setFileError('');
  };

  return (
    <BaseForm
      onSubmit={baseHandleSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel={mode === 'create' ? 'Upload Klaim' : 'Update Klaim'}
      className="max-w-4xl"
    >
      {/* File Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Dokumen Klaim
        </h3>
        
        <FormField
          label="File Klaim"
          name="claimFile"
          required={mode === 'create'}
          error={fileError}
          helpText="Upload dokumen klaim dalam format ZIP, atau RAR (Maksimal 10MB)"
        >
          <FileUpload
            name="claimFile"
            value={values.claimFile}
            onChange={handleFileChange}
            accept=".zip,.rar"
            maxSize={10}
            error={fileError}
            disabled={loading}
          />
        </FormField>

        {/* File Requirements */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Ketentuan File:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Format file: ZIP, RAR</li>
            <li>• Ukuran maksimal: 10MB</li>
            <li>• Pastikan file terbaca dengan jelas</li>
            <li>• Untuk multiple files, gunakan format ZIP/RAR</li>
            {mode === 'edit' && (
              <li>• Kosongkan jika tidak ingin mengubah file</li>
            )}
          </ul>
        </div>

        {/* Existing File Info (Edit Mode) */}
        {mode === 'edit' && initialData.existingFileName && !values.claimFile && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              File saat ini: <span className="font-medium">{initialData.existingFileName}</span>
            </p>
          </div>
        )}
      </div>
    </BaseForm>
  );
}