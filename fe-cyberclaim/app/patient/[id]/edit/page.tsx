// app/dashboard/patients/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { PatientForm } from '@/components/patients/PatientForm';
import { getPatient, updatePatient } from '@/lib/api/patients';
import { Patient } from '@/types/patient';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoadingPatient(true);
      const patientData = await getPatient(patientId);
      setPatient(patientData);
    } catch (error) {
      console.error('Failed to load patient:', error);
      setError('Gagal memuat data pasien');
    } finally {
      setLoadingPatient(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    
    try {
      await updatePatient(patientId, formData);
      router.push('/dashboard/patients');
    } catch (error: any) {
      console.error('Failed to update patient:', error);
      
      if (error.response?.status === 404) {
        alert('Pasien tidak ditemukan');
      } else if (error.response?.status === 400) {
        alert('Data yang dimasukkan tidak valid');
      } else {
        alert('Gagal mengupdate pasien');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingPatient) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">{error}</div>
            <button
              onClick={() => router.push('/dashboard/patients')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Pasien
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!patient) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-800 font-semibold mb-2">
              Pasien tidak ditemukan
            </div>
            <button
              onClick={() => router.push('/dashboard/patients')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Pasien
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kembali"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Data Pasien</h1>
              <p className="text-gray-600 mt-2">
                Perbarui informasi pasien {patient.name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <PatientForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="edit"
            initialData={patient}
          />
        </div>
      </div>
    </AdminLayout>
  );
}