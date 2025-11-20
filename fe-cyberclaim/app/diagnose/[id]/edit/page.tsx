// app/dashboard/diagnosis/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { DiagnosisForm } from '@/components/Features/Diagnose';
import { getDiagnosisById, updateDiagnosis } from '@/lib/api/diagnosis';
import { Diagnosis } from '@/types/diagnosis';

export default function EditDiagnosisPage() {
  const router = useRouter();
  const params = useParams();
  const diagnosisId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(true);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (diagnosisId) {
      loadDiagnosis();
    }
  }, [diagnosisId]);

  const loadDiagnosis = async () => {
    try {
      setLoadingDiagnosis(true);
      const diagnosisData = await getDiagnosisById(diagnosisId);
      setDiagnosis(diagnosisData);
    } catch (error) {
      console.error('Failed to load diagnosis:', error);
      setError('Gagal memuat data diagnosis');
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    
    try {
      await updateDiagnosis(diagnosisId, formData);
      router.push('/diagnose');
    } catch (error: any) {
      console.error('Failed to update diagnosis:', error);
      alert(error.message || 'Gagal mengupdate diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loadingDiagnosis) {
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
              onClick={() => router.push('/diagnose')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Diagnosis
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!diagnosis) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-800 font-semibold mb-2">
              Diagnosis tidak ditemukan
            </div>
            <button
              onClick={() => router.push('/diagnose')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Kembali ke Daftar Diagnosis
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
              <BackIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Data Diagnosis</h1>
              <p className="text-gray-600 mt-2">
                Perbarui informasi diagnosis {diagnosis.code}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DiagnosisForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="edit"
            initialData={diagnosis}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);