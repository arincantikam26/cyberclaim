// app/dashboard/patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { Patient } from '@/types/patient';
import { getPatients, deletePatient } from '@/lib/api/patients';
import {
  PatientGridView,
  PatientListView,
  PatientsEmptyState,
  ViewToggle,
  PatientsPagination
} from '@/components/patients';

// Constants
const ITEMS_PER_PAGE = 9;
const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

export default function PatientsListPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>(VIEW_TYPES.GRID);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, [currentPage, searchTerm]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined
      });
      
      setPatients(data.data);
      setTotalPages(data.totalPages);
      setTotalPatients(data.total);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deletePatient(id);
      await loadPatients(); // Reload to maintain pagination
    } catch (error) {
      console.error('Failed to delete patient:', error);
      alert('Gagal menghapus pasien');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPatients();
  };

  if (loading && patients.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Data Pasien</h1>
            <p className="text-gray-600 mt-2">
              Kelola semua data pasien yang terdaftar di sistem
              {totalPatients > 0 && (
                <span className="text-blue-600 font-semibold"> ({totalPatients} pasien)</span>
              )}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <ViewToggle 
              viewType={viewType} 
              onViewChange={setViewType} 
            />
            <button
              onClick={() => router.push('/dashboard/patients/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Pasien
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari pasien berdasarkan nama, NIK, atau BPJS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Patients Content */}
      {patients.length === 0 ? (
        <PatientsEmptyState 
          onAddPatient={() => router.push('/dashboard/patients/create')}
          hasSearch={!!searchTerm}
          onClearSearch={() => {
            setSearchTerm('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <>
          {viewType === VIEW_TYPES.GRID ? (
            <PatientGridView 
              patients={patients} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
            />
          ) : (
            <PatientListView 
              patients={patients} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
            />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <PatientsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalPatients}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

// Simple PlusIcon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);