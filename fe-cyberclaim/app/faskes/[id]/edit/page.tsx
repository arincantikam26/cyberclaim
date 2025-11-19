// app/dashboard/faskes/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { FaskesForm } from '@/components/Features/Faskes/FaskesForm';
// import { getFaskes, updateFaskes } from '@/lib/api/faskes';
import { faskesDummy } from '@/lib/dataDummy';

export default function EditFaskesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadFaskesData();
  }, [id]);

  const loadFaskesData = async () => {
    try {
    //   const faskes = await getFaskes(id);
      setInitialData(faskesDummy);
    } catch (error) {
      console.error('Failed to load faskes:', error);
      router.push('/dashboard/faskes');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
    //   await updateFaskes(id, data);
      router.push('/dashboard/faskes');
      // Show success toast
    } catch (error) {
      console.error('Failed to update faskes:', error);
      alert('Gagal mengupdate faskes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingData) {
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Faskes</h1>
          <p className="text-gray-600 mt-2">
            Update informasi faskes {initialData?.name}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <FaskesForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="edit"
          />
        </div>
      </div>
    </AdminLayout>
  );
}