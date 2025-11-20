// components/tarif/TarifHeader.tsx
'use client';

import { ViewType } from '@/components/common/ViewToggle';
import { ViewToggle } from '@/components/common/ViewToggle';

interface TarifHeaderProps {
  stats: {
    total: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    special: number;
    total_tarif: number;
  };
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  kelasFilter: string;
  onKelasFilterChange: (value: string) => void;
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
}

export default function TarifHeader({
  stats,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  kelasFilter,
  onKelasFilterChange,
  viewType,
  onViewChange
}: TarifHeaderProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mb-8">
      {/* Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarif INA-CBGS</h1>
          <p className="text-gray-600 mt-2">
            Kelola tarif Case Base Groups berdasarkan akumulasi diagnosis ICD-10 dan tindakan ICD-9
            <span className="text-blue-600 font-semibold"> ({stats.total} CBG)</span>
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <ViewToggle 
            viewType={viewType} 
            onViewChange={onViewChange} 
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total CBG</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Rendah</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.rendah}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TagIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Sedang</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.sedang}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TagIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Tinggi</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.tinggi}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TagIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Special</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.special}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TagIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Nilai</p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {formatRupiah(stats.total_tarif)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <form onSubmit={onSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Cari berdasarkan kode CBG, nama CBG, kode ICD-10, atau ICD-9..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Kelas Filter */}
            <div>
              <select
                value={kelasFilter}
                onChange={(e) => onKelasFilterChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Kelas</option>
                <option value="Rendah">Kelas Rendah</option>
                <option value="Sedang">Kelas Sedang</option>
                <option value="Tinggi">Kelas Tinggi</option>
                <option value="Special">Kelas Special</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Tarif INA-CBGS dihitung berdasarkan akumulasi diagnosis dan tindakan
            </div>
            <div className="flex space-x-3">
              {(searchTerm || kelasFilter !== 'all') && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold flex items-center"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Reset
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold flex items-center"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Cari Tarif
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icon Components
const DocumentChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const ArrowPathIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);