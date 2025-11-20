// components/tarif/TarifListView.tsx
'use client';

import { InacbgsTarif } from '@/types/inacbgs';
import { DataList } from '@/components/common/DataList';
import TarifCard from './TarifCard';

interface TarifListViewProps {
  tarif: InacbgsTarif[];
  onViewDetail: (tarif: InacbgsTarif) => void;
  loading?: boolean;
}

export default function TarifListView({ 
  tarif, 
  onViewDetail, 
  loading = false 
}: TarifListViewProps) {
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
    <DataList
      data={tarif}
      columns={[
        {
          key: 'kode_cbg',
          label: 'Kode CBG',
          width: 'auto',
          render: (value, item: InacbgsTarif) => (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.kode_cbg}</div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${getKelasColor(item.kelas_rawat)}`}>
                  {item.kelas_rawat}
                </div>
              </div>
            </div>
          )
        },
        {
          key: 'nama_cbg',
          label: 'Nama Case Group',
          width: 'auto',
          render: (value, item: InacbgsTarif) => (
            <div>
              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.nama_cbg}
              </div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <DocumentTextIcon className="w-3 h-3 mr-1" />
                  {item.komponen_tarif.diagnosis.length} diagnosis
                </span>
                <span className="flex items-center">
                  <CogIcon className="w-3 h-3 mr-1" />
                  {item.komponen_tarif.tindakan.length} tindakan
                </span>
              </div>
            </div>
          )
        },
        {
          key: 'tarif',
          label: 'Tarif',
          width: 'auto',
          render: (value, item: InacbgsTarif) => (
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {formatRupiah(item.tarif)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Total akumulasi
              </div>
            </div>
          )
        },
        {
          key: 'actions',
          label: 'Aksi',
          width: '20',
          className: 'text-right',
          render: (value, item: InacbgsTarif) => (
            <button
              onClick={() => onViewDetail(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold flex items-center text-sm"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Detail
            </button>
          )
        }
      ]}
      loading={loading}
    />
  );
}

// Icon Components
const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31 2.37 2.37a1.724 1.724 0 002.572 1.065c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 00-1.066-2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94 1.543.826 3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);