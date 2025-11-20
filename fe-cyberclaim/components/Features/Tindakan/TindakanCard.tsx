// components/diagnosis/DiagnosisCard.tsx
'use client';

import { Tindakan } from '@/types/tindakan';
import {
  DocumentTextIcon,
  CodeBracketIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { DataCard } from '@/components/common/DataCard';
import { ActionButtons } from '@/components/common/ActionButtons';

interface TindakanCardProps {
  tindakan: Tindakan;
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  viewType: 'grid' | 'list';
}

export default function TindakanCard({ 
  tindakan, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  viewType 
}: TindakanCardProps) {
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
        data={tindakan}
        title={tindakan.description}
        subtitle={`Kode: ${tindakan.code}`}
        badge={{
          text: 'ICD-10',
          color: 'blue'
        }}
        fields={[
          {
            icon: <CodeBracketIcon />,
            label: 'Kode',
            value: tindakan.code
          },
          {
            icon: <DocumentTextIcon />,
            label: 'Deskripsi',
            value: tindakan.description,
            truncate: true
          },
          {
            icon: <CalendarIcon />,
            label: 'Diperbarui',
            value: formatDate(tindakan.updated_at)
          }
        ]}
        actions={
          <ActionButtons
            onEdit={() => onEdit(`/tindakan/${tindakan.id}/edit`)}
            onDelete={() => onDelete(tindakan.id)}
            deleteLoading={deleteLoading === tindakan.id}
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
            <div className="text-sm font-medium text-gray-900">{tindakan.code}</div>
            <div className="text-sm text-gray-500">ICD-9</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 line-clamp-2">{tindakan.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(tindakan.created_at)}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons
          onEdit={() => onEdit(`/tindakan/${tindakan.id}/edit`)}
          onDelete={() => onDelete(tindakan.id)}
          deleteLoading={deleteLoading === tindakan.id}
          size="sm"
        />
      </td>
    </tr>
  );
}