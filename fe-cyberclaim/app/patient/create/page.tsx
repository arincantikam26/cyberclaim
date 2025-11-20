// app/dashboard/patients/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { PatientForm } from '@/components/patients/PatientForm';
import { createPatient } from '@/lib/api/patients';

export default function CreatePatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      await createPatient(data);
      router.push('/dashboard/patients');
    } catch (error) {
      console.error('Failed to create patient:', error);
      alert('Gagal membuat pasien');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Pasien Baru</h1>
          <p className="text-gray-600 mt-2">
            Isi formulir di bawah untuk menambahkan pasien baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <PatientForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="create"
          />
        </div>
      </div>
    </AdminLayout>
  );
}