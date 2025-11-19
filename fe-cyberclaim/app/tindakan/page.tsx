// pages/dashboard.tsx

'use client';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import StatCard from '@/components/Layout/admin/StatCard';
import Table from '@/components/UI/Table/Table';
import { useEffect, useState } from 'react';


export default function Inacbgs() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mockData = [
    {
      id: '1',
      kode: '00.10',
      description: 'Injection of thrombolytic into vessel of head and neck',
    },
    {
      id: '2',
      kode: '00.10',
      description: 'Pneumonia',
    }
  ]

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
      // width: '120px'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      filterable: true,
      align: 'center' as const,
      // width: '150px'
    },
  ];

  
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

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    // Navigate to detail page or show modal
    // router.push(`/inacbgs/tindakan/${row.id}`);
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tindakan ICD-9</h1>
        <p className="text-gray-600 mt-2">Data deskripsi kode tindakan: ICD-9</p>
      </div>

      {/* Main Content Grid */}
      <div className="lg:col-span-2 overflow-x-auto">
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
    </AdminLayout>
  );
}