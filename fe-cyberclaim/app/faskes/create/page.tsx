// app/dashboard/faskes/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { FaskesForm } from '@/components/Features/Faskes/FaskesForm';
// import { createFaskes } from '@/lib/api/faskes';

export default function CreateFaskesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      // await createFaskes(data);
      router.push('/dashboard/faskes');
      // Show success toast
    } catch (error) {
      console.error('Failed to create faskes:', error);
      alert('Gagal membuat faskes');
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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Faskes Baru</h1>
          <p className="text-gray-600 mt-2">
            Isi formulir di bawah untuk menambahkan faskes baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <FaskesForm
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