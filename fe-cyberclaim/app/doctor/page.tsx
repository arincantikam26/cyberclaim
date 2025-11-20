// app/dashboard/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { Doctor } from '@/types/doctor';
import { getDoctors, deleteDoctor } from '@/lib/api/doctors';
import {
  DoctorGridView,
  DoctorListView,
  DoctorsEmptyState,
  ViewToggle,
  DoctorsPagination
} from '@/components/Features/Doctor';

// Constants
const ITEMS_PER_PAGE = 9;
const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

interface DoctorsResponse {
  data: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}

export default function DoctorsListPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>(VIEW_TYPES.GRID);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    loadDoctors();
  }, [currentPage]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      // Assuming your API supports pagination
      const data: DoctorsResponse = await getDoctors({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      
      setDoctors(data.data);
      setTotalPages(data.totalPages);
      setTotalDoctors(data.total);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteDoctor(id);
      // Reload doctors to ensure pagination is correct
      await loadDoctors();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      alert('Gagal menghapus dokter');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && doctors.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Data Dokter</h1>
            <p className="text-gray-600 mt-2">
              Kelola semua data dokter yang terdaftar di sistem
              {totalDoctors > 0 && (
                <span className="text-blue-600 font-semibold"> ({totalDoctors} dokter)</span>
              )}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <ViewToggle 
              viewType={viewType} 
              onViewChange={setViewType} 
            />
            <button
              onClick={() => router.push('/doctor/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Dokter
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Content */}
      {doctors.length === 0 ? (
        <DoctorsEmptyState onAddDoctor={() => router.push('/doctors/create')} />
      ) : (
        <>
          {viewType === VIEW_TYPES.GRID ? (
            <DoctorGridView 
              doctors={doctors} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
            />
          ) : (
            <DoctorListView 
              doctors={doctors} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
            />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <DoctorsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalDoctors}
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

// Simple PlusIcon component since it's not imported from heroicons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);