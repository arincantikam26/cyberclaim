// app/inacbgs/tindakan/page.tsx - Contoh penggunaan dengan komponen baru
'use client';

import { useState, useEffect } from 'react';
import  Table  from '@/components/UI/Table/Table';
import INA_CBGsHeader from '@/components/INA-CBGs/Header';

// Mock data
const mockData = [
  {
    id: '1',
    kode: '00.10',
    nama: 'Injection of thrombolytic into vessel of head and neck',
    kategori: 'Kardiovaskular',
    status: 'Active',
    tarif: 1250000,
    updatedAt: '2024-01-15',
    createdBy: 'Admin RS A'
  },
  {
    id: '2',
    kode: '00.11',
    nama: 'Injection of other agent into vessel of head and neck',
    kategori: 'Kardiovaskular',
    status: 'Active',
    tarif: 1100000,
    updatedAt: '2024-01-14',
    createdBy: 'Admin RS B'
  },
  {
    id: '3',
    kode: '00.12',
    nama: 'Percutaneous transluminal coronary angioplasty (PTCA)',
    kategori: 'Intervensi Kardiak',
    status: 'Inactive',
    tarif: 3500000,
    updatedAt: '2024-01-13',
    createdBy: 'Admin RS C'
  },
  // ... more data
];

export default function TindakanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  const columns = [
    {
      key: 'kode',
      label: 'Kode ICD-9',
      sortable: true,
      filterable: true,
      align: 'center' as const,
      width: '120px'
    },
    {
      key: 'nama',
      label: 'Nama Tindakan',
      sortable: true,
      filterable: true,
      truncate: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {value}
          </div>
          <div className="text-xs text-gray-500 mt-1">ID: {row.id}</div>
        </div>
      )
    },
    {
      key: 'kategori',
      label: 'Kategori',
      sortable: true,
      filterable: true,
      align: 'center' as const,
      width: '150px'
    },
    {
      key: 'tarif',
      label: 'Tarif',
      sortable: true,
      align: 'right' as const,
      width: '140px',
      render: (value: number) => (
        <div className="text-right">
          <span className="font-semibold text-green-600">
            Rp {value.toLocaleString('id-ID')}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      align: 'center' as const,
      width: '120px',
      render: (value: string) => (
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${value === 'Active' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}>
          {value === 'Active' ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Aktif
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Nonaktif
            </>
          )}
        </span>
      )
    },
    {
      key: 'createdBy',
      label: 'Dibuat Oleh',
      sortable: true,
      filterable: true,
      align: 'center' as const,
      width: '140px'
    },
    {
      key: 'updatedAt',
      label: 'Diupdate',
      sortable: true,
      align: 'center' as const,
      width: '120px',
      render: (value: string) => (
        <div className="text-center">
          <div className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString('id-ID')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )
    }
  ];

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    // Navigate to detail page or show modal
    // router.push(`/inacbgs/tindakan/${row.id}`);
  };

  const customEmptyState = (
    <tr>
      <td colSpan={columns.length} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data Tindakan</h3>
          <p className="text-gray-500 mb-4">Mulai tambahkan data tindakan ICD-9 pertama Anda</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            + Tambah Tindakan Pertama
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <INA_CBGsHeader 
        title="Tindakan (ICD-9)"
        description="Kelola kode prosedur dan tindakan medis berdasarkan ICD-9"
      />
      
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Total Tindakan: {data.length}</h2>
            <p className="opacity-90">Semua kode prosedur ICD-9 yang terdaftar dalam sistem</p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg">
            + Tambah Tindakan Baru
          </button>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={data}
        pageSize={5}
        searchable={true}
        filterable={true}
        onRowClick={handleRowClick}
        loading={loading}
        striped={true}
        hoverable={true}
        emptyState={customEmptyState}
      />
    </div>
  );
}