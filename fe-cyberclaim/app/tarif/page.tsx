// app/dashboard/tarif/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { InacbgsTarif } from '@/types/inacbgs';
import { mockInacbgs } from '@/lib/mock-data/mockInacbgs';
import { TarifHeader,TarifGridView, TarifListView, TarifEmptyState} from '@/components/Features/Tarif';
import { ViewType } from '@/components/common/ViewToggle';
import { ViewToggle } from '@/components/common/ViewToggle';

// Constants
const ITEMS_PER_PAGE = 8;

export default function TarifListPage() {
  const router = useRouter();
  const [tarif, setTarif] = useState<InacbgsTarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [kelasFilter, setKelasFilter] = useState<string>('all');
  const [selectedTarif, setSelectedTarif] = useState<InacbgsTarif | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadTarif();
  }, [currentPage, searchTerm, kelasFilter]);

  const loadTarif = async () => {
    try {
      setLoading(true);
      
      // Simulasi API call dengan filter
      let filteredData = [...mockInacbgs];
      
      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(item =>
          item.kode_cbg.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nama_cbg.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.komponen_tarif.diagnosis.some(d => 
            d.kode_icd10.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          item.komponen_tarif.tindakan.some(t =>
            t.kode_icd9.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      // Apply kelas filter
      if (kelasFilter !== 'all') {
        filteredData = filteredData.filter(item => item.kelas_rawat === kelasFilter);
      }
      
      // Simulate pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setTarif(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to load tarif:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadTarif();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setKelasFilter('all');
    setCurrentPage(1);
  };

  const handleViewDetail = (tarif: InacbgsTarif) => {
    setSelectedTarif(tarif);
    setShowDetail(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    localStorage.setItem('tarifViewType', newViewType);
  };

  // Calculate statistics
  const stats = {
    total: mockInacbgs.length,
    rendah: mockInacbgs.filter(item => item.kelas_rawat === 'Rendah').length,
    sedang: mockInacbgs.filter(item => item.kelas_rawat === 'Sedang').length,
    tinggi: mockInacbgs.filter(item => item.kelas_rawat === 'Tinggi').length,
    special: mockInacbgs.filter(item => item.kelas_rawat === 'Special').length,
    total_tarif: mockInacbgs.reduce((sum, item) => sum + item.tarif, 0)
  };

  useEffect(() => {
    const savedViewType = localStorage.getItem('tarifViewType') as ViewType;
    if (savedViewType && (savedViewType === 'grid' || savedViewType === 'list')) {
      setViewType(savedViewType);
    }
  }, []);

  if (loading && tarif.length === 0) {
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <TarifHeader
            stats={stats}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearch}
            onClearSearch={clearSearch}
            kelasFilter={kelasFilter}
            onKelasFilterChange={setKelasFilter}
            viewType={viewType}
            onViewChange={handleViewChange}
          />

          {/* View Info Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              {viewType === 'grid' ? 'Tampilan Grid' : 'Tampilan List'}
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  • Pencarian: {searchTerm}
                </span>
              )}
              {kelasFilter !== 'all' && (
                <span className="ml-2 text-green-600">
                  • Kelas: {kelasFilter}
                </span>
              )}
            </div>
            
            {/* Mobile View Toggle */}
            <div className="sm:hidden">
              <ViewToggle 
                viewType={viewType} 
                onViewChange={handleViewChange}
                size="sm"
              />
            </div>
          </div>

          {/* Tarif Content */}
          {tarif.length === 0 ? (
            <TarifEmptyState 
              hasSearch={!!searchTerm || kelasFilter !== 'all'}
              onClearSearch={clearSearch}
            />
          ) : (
            <>
              {viewType === 'grid' ? (
                <TarifGridView 
                  tarif={tarif}
                  onViewDetail={handleViewDetail}
                  loading={loading}
                />
              ) : (
                <TarifListView 
                  tarif={tarif}
                  onViewDetail={handleViewDetail}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* Detail Modal */}
          {showDetail && selectedTarif && (
            <TarifDetailModal
              tarif={selectedTarif}
              onClose={() => setShowDetail(false)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// Tarif Detail Modal Component
const TarifDetailModal = ({ 
  tarif, 
  onClose 
}: { 
  tarif: InacbgsTarif; 
  onClose: () => void;
}) => {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getKelasColor = (kelas: string) => {
    switch (kelas) {
      case 'Rendah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-blue-100 text-blue-800';
      case 'Tinggi': return 'bg-orange-100 text-orange-800';
      case 'Special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Detail Tarif INA-CBGS</h2>
              <p className="text-blue-100">Komponen detail tarif {tarif.nama_cbg}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-semibold">Kode CBG</div>
              <div className="text-2xl font-bold text-blue-800 mt-1">{tarif.kode_cbg}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="text-sm text-green-600 font-semibold">Kelas Rawat</div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getKelasColor(tarif.kelas_rawat)}`}>
                {tarif.kelas_rawat}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="text-sm text-purple-600 font-semibold">Total Tarif</div>
              <div className="text-2xl font-bold text-purple-800 mt-1">
                {formatRupiah(tarif.tarif)}
              </div>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
              Diagnosis ICD-10
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {tarif.komponen_tarif.diagnosis.map((diagnosis, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <div className="font-semibold text-gray-900">{diagnosis.kode_icd10}</div>
                    <div className="text-sm text-gray-600 mt-1">{diagnosis.deskripsi}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatRupiah(diagnosis.tarif)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tindakan Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CogIcon className="w-5 h-5 mr-2 text-green-600" />
              Tindakan ICD-9
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {tarif.komponen_tarif.tindakan.map((tindakan, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{tindakan.kode_icd9}</div>
                    <div className="text-sm text-gray-600 mt-1">{tindakan.deskripsi}</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatRupiah(tindakan.tarif)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Total Akumulasi Tarif</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {tarif.komponen_tarif.diagnosis.length} diagnosis + {tarif.komponen_tarif.tindakan.length} tindakan
                </p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatRupiah(tarif.tarif)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon Components
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);