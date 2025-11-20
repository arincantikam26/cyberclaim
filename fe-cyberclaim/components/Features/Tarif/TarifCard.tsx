// components/tarif/TarifCard.tsx
'use client';

import { InacbgsTarif } from '@/types/inacbgs';
import {
  DocumentTextIcon,
  CogIcon,
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface TarifCardProps {
  tarif: InacbgsTarif;
  onViewDetail: (tarif: InacbgsTarif) => void;
  viewType: 'grid' | 'list';
}

export default function TarifCard({ 
  tarif, 
  onViewDetail, 
  viewType 
}: TarifCardProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getKelasColor = (kelas: string) => {
    switch (kelas) {
      case 'Rendah': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sedang': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tinggi': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Special': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKelasGradient = (kelas: string) => {
    switch (kelas) {
      case 'Rendah': return 'from-green-500 to-green-600';
      case 'Sedang': return 'from-blue-500 to-blue-600';
      case 'Tinggi': return 'from-orange-500 to-orange-600';
      case 'Special': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Grid View Card
  if (viewType === 'grid') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Header dengan gradient */}
        <div className={`bg-gradient-to-r ${getKelasGradient(tarif.kelas_rawat)} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{tarif.kode_cbg}</h3>
              <p className="text-blue-100 text-sm mt-1">{tarif.nama_cbg}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30 text-white`}>
              {tarif.kelas_rawat}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tarif Amount */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-900">
              {formatRupiah(tarif.tarif)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Tarif</div>
          </div>

          {/* Komponen Breakdown */}
          <div className="space-y-4">
            {/* Diagnosis Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-semibold text-gray-700">
                  <DocumentTextIcon className="w-4 h-4 mr-2 text-blue-600" />
                  Diagnosis ICD-10
                </div>
                <span className="text-xs text-gray-500">
                  {tarif.komponen_tarif.diagnosis.length} item
                </span>
              </div>
              <div className="space-y-2">
                {tarif.komponen_tarif.diagnosis.map((diagnosis, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {diagnosis.kode_icd10}
                    </span>
                    <span className="text-green-600 font-semibold whitespace-nowrap">
                      {formatRupiah(diagnosis.tarif)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tindakan Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-semibold text-gray-700">
                  <CogIcon className="w-4 h-4 mr-2 text-green-600" />
                  Tindakan ICD-9
                </div>
                <span className="text-xs text-gray-500">
                  {tarif.komponen_tarif.tindakan.length} item
                </span>
              </div>
              <div className="space-y-2">
                {tarif.komponen_tarif.tindakan.slice(0, 3).map((tindakan, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {tindakan.kode_icd9}
                    </span>
                    <span className="text-blue-600 font-semibold whitespace-nowrap">
                      {formatRupiah(tindakan.tarif)}
                    </span>
                  </div>
                ))}
                {tarif.komponen_tarif.tindakan.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{tarif.komponen_tarif.tindakan.length - 3} tindakan lainnya
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Komponen:</span>
              <span className="font-semibold text-gray-900">
                {tarif.komponen_tarif.diagnosis.length + tarif.komponen_tarif.tindakan.length} item
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onViewDetail(tarif)}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-xl transition-all font-semibold flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Lihat Detail Lengkap
          </button>
        </div>
      </div>
    );
  }

  // List View sudah ditangani oleh TarifListView
  return null;
}

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);