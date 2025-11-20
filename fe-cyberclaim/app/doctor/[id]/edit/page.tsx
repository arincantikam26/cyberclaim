// app/dashboard/doctors/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { DoctorForm } from '@/components/Features/Doctor/DoctorForm';
import { getDoctor, updateDoctor } from '@/lib/api/doctors';
// import { getFaskes } from '@/lib/api/faskes';
import { Faskes } from '@/types/faskes';
import { Doctor } from '@/types/doctor';

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [faskesList, setFaskesList] = useState<Faskes[]>([]);
  const [loadingFaskes, setLoadingFaskes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      loadDoctorAndFaskes();
    }
  }, [doctorId]);

  const loadDoctorAndFaskes = async () => {
    try {
      setLoadingDoctor(true);
      setLoadingFaskes(true);
      
      // Load doctor data and faskes in parallel
      const [doctorData, faskesData] = await Promise.all([
        getDoctor(doctorId),
        // getFaskes()
        Promise.resolve([]) // Temporary placeholder
      ]);
      
      setDoctor(doctorData);
      setFaskesList(faskesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Gagal memuat data dokter');
    } finally {
      setLoadingDoctor(false);
      setLoadingFaskes(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    
    try {
      await updateDoctor(doctorId, formData);
      router.push('/dashboard/doctors');
      // Optional: Show success message
    } catch (error: any) {
      console.error('Failed to update doctor:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        alert('Dokter tidak ditemukan');
      } else if (error.response?.status === 400) {
        alert('Data yang dimasukkan tidak valid');
      } else {
        alert('Gagal mengupdate dokter');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Loading state
  if (loadingDoctor) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">{error}</div>
            <button
              onClick={() => router.push('/dashboard/doctors')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Dokter
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Doctor not found
  if (!doctor) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-800 font-semibold mb-2">
              Dokter tidak ditemukan
            </div>
            <button
              onClick={() => router.push('/dashboard/doctors')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Dokter
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Data Dokter</h1>
              <p className="text-gray-600 mt-2">
                Perbarui informasi dokter {doctor.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DoctorForm
            faskesList={faskesList}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="edit"
            initialData={doctor}
            loadingFaskes={loadingFaskes}
          />
        </div>
      </div>
    </AdminLayout>
  );
}