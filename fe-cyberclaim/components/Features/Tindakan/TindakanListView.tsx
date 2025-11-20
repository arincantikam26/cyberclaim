// components/diagnosis/DiagnosisListView.tsx
'use client';

import { Tindakan } from '@/types/tindakan';
import { DataList } from '@/components/common/DataList';
import TindakanCard from './TindakanCard';
import TindakanEmptyState from './TindakanEmptyState';
import { ActionButtons } from '@/components/common/ActionButtons';
import {
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface TindakanListViewProps {
  tindakan: Tindakan[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function TindakanListView({ 
  tindakan, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: TindakanListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <DataList
      data={tindakan}
      columns={[
        {
          key: 'code',
          label: 'Kode ICD-9',
          width: 'auto',
          render: (value, tindakan: Tindakan) => (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3 bg-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">{tindakan.code}</div>
                <div className="text-sm text-gray-500">ICD-10</div>
              </div>
            </div>
          )
        },
        {
          key: 'description',
          label: 'Deskripsi Tindakan',
          width: 'auto',
          render: (value, tindakan: Tindakan) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-start space-x-1">
                <DocumentTextIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{tindakan.description}</span>
              </div>
            </div>
          )
        },
        {
          key: 'created_at',
          label: 'Dibuat',
          width: 'auto',
          render: (value, tindakan: Tindakan) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(tindakan.created_at)}</span>
              </div>
            </div>
          )
        },
        {
          key: 'actions',
          label: 'Aksi',
          width: '24',
          className: 'text-right',
          render: (value, tindakan: Tindakan) => (
            <ActionButtons
              onEdit={() => onEdit(`/tindakan/${tindakan.id}/edit`)}
              onDelete={() => onDelete(tindakan.id)}
              deleteLoading={deleteLoading === tindakan.id}
              size="sm"
            />
          )
        }
      ]}
      emptyState={
        <TindakanEmptyState 
          onAddDiagnosis={() => window.location.href = '/tindakan/create'}
        />
      }
      loading={loading}
    />
  );
}