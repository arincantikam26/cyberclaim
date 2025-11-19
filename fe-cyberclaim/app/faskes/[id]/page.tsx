// app/dashboard/faskes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { Faskes } from '@/types/faskes';
import { faskesDummy } from '@/lib/dataDummy';
// import { getFaskes, deleteFaskes } from '@/lib/api/faskes';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function FaskesListPage() {
  const router = useRouter();
  const [faskes, setFaskes] = useState<Faskes[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadFaskes();
  }, []);

  const loadFaskes = async () => {
    try {
      setFaskes(faskesDummy);
    } catch (error) {
      console.error('Failed to load faskes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus faskes ini?')) {
      return;
    }

    setDeleteLoading(id);
    try {
    //   await deleteFaskes(id);
      setFaskes(prev => prev.filter(f => f.id !== id));
      // Show success message
    } catch (error) {
      console.error('Failed to delete faskes:', error);
      alert('Gagal menghapus faskes');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getJenisSaranaLabel = (id: number) => {
    const labels: { [key: number]: string } = {
      1: 'Rumah Sakit',
      2: 'Klinik',
      3: 'Puskesmas',
      4: 'Laboratorium',
      5: 'Apotek'
    };
    return labels[id] || 'Unknown';
  };

  if (loading) {
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
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Faskes</h1>
            <p className="text-gray-600 mt-2">
              Kelola semua data fasilitas kesehatan yang terdaftar
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/faskes/create')}
            className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah Faskes
          </button>
        </div>
      </div>

      {/* Faskes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faskes.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.operasional ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {getJenisSaranaLabel(item.jenis_sarana_id)}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => router.push(`/dashboard/faskes/${item.id}/edit`)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  disabled={deleteLoading === item.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Hapus"
                >
                  {deleteLoading === item.id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Faskes Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500 font-mono">{item.code}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{item.telp}</span>
                </div>
                
                {item.website && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <GlobeAltIcon className="w-4 h-4" />
                    <a 
                      href={item.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 truncate"
                    >
                      {item.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 mt-0.5" />
                  <span className="flex-1">
                    {item.address}, {item.city}, {item.province}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.operasional 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.operasional ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {faskes.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum ada faskes</h3>
          <p className="mt-2 text-gray-500">
            Mulai dengan menambahkan faskes pertama Anda
          </p>
          <button
            onClick={() => router.push('/dashboard/faskes/create')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold"
          >
            Tambah Faskes Pertama
          </button>
        </div>
      )}
    </AdminLayout>
  );
}