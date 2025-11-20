// app/dashboard/diagnosis/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { Tindakan } from '@/types/tindakan';
import { getTindakan, deleteTindakan, getTindakanStats } from '@/lib/api/tindakan';
import {
  TindakanGridView,
  TindakanListView,
  TindakanEmptyState,
  ViewToggle,
  TindakanPagination
} from '@/components/Features/Tindakan';
import { ViewType } from '@/components/common/ViewToggle';

// Constants
const ITEMS_PER_PAGE = 9;

export default function TindakanListPage() {
  const router = useRouter();
  const [tindakan, setTindakan] = useState<Tindakan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTindakan, setTotalTindakan] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    recent: 0
  });

  useEffect(() => {
    loadTindakan();
    loadStats();
  }, [currentPage, searchTerm]);

  const loadTindakan = async () => {
    try {
      setLoading(true);
      const data = await getTindakan({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined
      });
      
      setTindakan(data.data);
      setTotalPages(data.totalPages);
      setTotalTindakan(data.total);
    } catch (error) {
      console.error('Failed to load tindakan:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getTindakanStats();
      setStats({
        total: statsData.total,
        recent: statsData.recent
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tindakan ini?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteTindakan(id);
      await loadTindakan();
      await loadStats();
    } catch (error) {
      console.error('Failed to delete tindakan:', error);
      alert('Gagal menghapus tindakan');
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
    loadTindakan();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleViewChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    localStorage.setItem('tindakanViewType', newViewType);
  };

  // Load saved view preference on component mount
  useEffect(() => {
    const savedViewType = localStorage.getItem('tindakanViewType') as ViewType;
    if (savedViewType && (savedViewType === 'grid' || savedViewType === 'list')) {
      setViewType(savedViewType);
    }
  }, []);

  if (loading && tindakan.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Data Tindakan ICD-10</h1>
            <p className="text-gray-600 mt-2">
              Kelola semua kode dan deskripsi tindakan ICD-10
              {totalTindakan > 0 && (
                <span className="text-blue-600 font-semibold"> ({totalTindakan} tindakan)</span>
              )}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <ViewToggle 
              viewType={viewType} 
              onViewChange={handleViewChange} 
            />
            <button
              onClick={() => router.push('/tindakan/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Tindakan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tindakan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DiagnosisIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tindakan Baru (30 hari)</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.recent}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <NewDiagnosisIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari tindakan berdasarkan kode atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Cari
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
                >
                  <ResetIcon className="w-5 h-5 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* View Info Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {viewType === 'grid' ? 'Tampilan Grid' : 'Tampilan List'}
          {searchTerm && (
            <span className="ml-2 text-blue-600">
              • Pencarian: {searchTerm}
            </span>
          )}
        </div>
        
        {/* Mobile View Toggle */}
        <div className="lg:hidden">
          <ViewToggle 
            viewType={viewType} 
            onViewChange={handleViewChange}
            size="sm"
          />
        </div>
      </div>

      {/* Diagnosis Content */}
      {tindakan.length === 0 ? (
        <TindakanEmptyState
          onAddTindakan={() => router.push('/diagnosis/create')}
          hasSearch={!!searchTerm}
          onClearSearch={clearSearch}
        />
      ) : (
        <>
          {viewType === 'grid' ? (
            <TindakanGridView 
              tindakan={tindakan} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
              loading={loading}
            />
          ) : (
            <TindakanListView 
              tindakan={tindakan} 
              onEdit={router.push} 
              onDelete={handleDelete} 
              deleteLoading={deleteLoading} 
              loading={loading}
            />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <TindakanPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalTindakan}
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

// Icon Components
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ResetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DiagnosisIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const NewDiagnosisIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);