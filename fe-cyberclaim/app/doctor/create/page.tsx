// app/dashboard/doctors/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { DoctorForm } from '@/components/Features/Doctor/DoctorForm';
import { createDoctor } from '@/lib/api/doctors';
// import { getFaskes } from '@/lib/api/faskes';
import { Faskes } from '@/types/faskes';



export default function CreateDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [faskesList, setFaskesList] = useState<Faskes[]>([]);
  const [loadingFaskes, setLoadingFaskes] = useState(true);

  useEffect(() => {
    loadFaskes();
  }, []);

  const loadFaskes = async () => {
    try {
    //   const data = await getFaskes();
      setFaskesList(data);
    } catch (error) {
      console.error('Failed to load faskes:', error);
    } finally {
      setLoadingFaskes(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      await createDoctor(data);
      router.push('/doctors');
    } catch (error) {
      console.error('Failed to create doctor:', error);
      alert('Gagal membuat dokter');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingFaskes) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Dokter Baru</h1>
          <p className="text-gray-600 mt-2">
            Isi formulir di bawah untuk menambahkan dokter baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DoctorForm
            faskesList={faskesList}
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