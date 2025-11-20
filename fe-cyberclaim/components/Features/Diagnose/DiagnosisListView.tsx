// components/diagnosis/DiagnosisListView.tsx
'use client';

import { Diagnosis } from '@/types/diagnosis';
import { DataList } from '@/components/common/DataList';
import DiagnosisCard from './DiagnosisCard';
import DiagnosisEmptyState from './DiagnosisEmptyState';
import { ActionButtons } from '@/components/common/ActionButtons';
import {
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface DiagnosisListViewProps {
  diagnosis: Diagnosis[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function DiagnosisListView({ 
  diagnosis, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: DiagnosisListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <DataList
      data={diagnosis}
      columns={[
        {
          key: 'code',
          label: 'Kode ICD-9',
          width: 'auto',
          render: (value, diagnosis: Diagnosis) => (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3 bg-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">{diagnosis.code}</div>
                <div className="text-sm text-gray-500">ICD-9</div>
              </div>
            </div>
          )
        },
        {
          key: 'description',
          label: 'Deskripsi Diagnosis',
          width: 'auto',
          render: (value, diagnosis: Diagnosis) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-start space-x-1">
                <DocumentTextIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{diagnosis.description}</span>
              </div>
            </div>
          )
        },
        {
          key: 'created_at',
          label: 'Dibuat',
          width: 'auto',
          render: (value, diagnosis: Diagnosis) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(diagnosis.created_at)}</span>
              </div>
            </div>
          )
        },
        {
          key: 'actions',
          label: 'Aksi',
          width: '24',
          className: 'text-right',
          render: (value, diagnosis: Diagnosis) => (
            <ActionButtons
              onEdit={() => onEdit(`/diagnose/${diagnosis.id}/edit`)}
              onDelete={() => onDelete(diagnosis.id)}
              deleteLoading={deleteLoading === diagnosis.id}
              size="sm"
            />
          )
        }
      ]}
      emptyState={
        <DiagnosisEmptyState 
          onAddDiagnosis={() => window.location.href = '/diagnose/create'}
        />
      }
      loading={loading}
    />
  );
}