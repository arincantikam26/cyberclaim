// app/dashboard/diagnosis/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { TindakanForm } from '@/components/Features/Tindakan';
import { createTindakan } from '@/lib/api/tindakan';

export default function CreateTindakanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      await createTindakan(data);
      router.push('/tindakan');
    } catch (error: any) {
      console.error('Failed to create tindakan:', error);
      alert(error.message || 'Gagal membuat tindakan');
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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Tindakan Baru</h1>
          <p className="text-gray-600 mt-2">
            Isi formulir di bawah untuk menambahkan kode tindakan ICD-10 baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TindakanForm
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