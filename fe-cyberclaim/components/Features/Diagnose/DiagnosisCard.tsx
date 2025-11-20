// components/diagnosis/DiagnosisCard.tsx
'use client';

import { Diagnosis } from '@/types/diagnosis';
import {
  DocumentTextIcon,
  CodeBracketIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { DataCard } from '@/components/common/DataCard';
import { ActionButtons } from '@/components/common/ActionButtons';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  viewType: 'grid' | 'list';
}

export default function DiagnosisCard({ 
  diagnosis, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  viewType 
}: DiagnosisCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Grid View menggunakan DataCard reusable
  if (viewType === 'grid') {
    return (
      <DataCard
        data={diagnosis}
        title={diagnosis.description}
        subtitle={`Kode: ${diagnosis.code}`}
        badge={{
          text: 'ICD-9',
          color: 'blue'
        }}
        fields={[
          {
            icon: <CodeBracketIcon />,
            label: 'Kode',
            value: diagnosis.code
          },
          {
            icon: <DocumentTextIcon />,
            label: 'Deskripsi',
            value: diagnosis.description,
            truncate: true
          },
          {
            icon: <CalendarIcon />,
            label: 'Diperbarui',
            value: formatDate(diagnosis.updated_at)
          }
        ]}
        actions={
          <ActionButtons
            onEdit={() => onEdit(`/diagnose/${diagnosis.id}/edit`)}
            onDelete={() => onDelete(diagnosis.id)}
            deleteLoading={deleteLoading === diagnosis.id}
          />
        }
      />
    );
  }

  // List View
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-3 bg-blue-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">{diagnosis.code}</div>
            <div className="text-sm text-gray-500">ICD-9</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 line-clamp-2">{diagnosis.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(diagnosis.created_at)}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons
          onEdit={() => onEdit(`/diagnose/${diagnosis.id}/edit`)}
          onDelete={() => onDelete(diagnosis.id)}
          deleteLoading={deleteLoading === diagnosis.id}
          size="sm"
        />
      </td>
    </tr>
  );
}