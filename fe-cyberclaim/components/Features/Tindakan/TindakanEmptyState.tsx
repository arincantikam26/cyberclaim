// components/diagnosis/DiagnosisEmptyState.tsx
'use client';

import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common/EmptyState';

interface TindakanEmptyStateProps {
  onAddTindakan: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

export default function TindakanEmptyState({ 
  onAddTindakan, 
  hasSearch = false,
  onClearSearch 
}: TindakanEmptyStateProps) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon className="h-12 w-12" />}
        title="Tindakan tidak ditemukan"
        description="Tidak ada tindakan yang sesuai dengan pencarian Anda"
        action={
          onClearSearch && {
            label: 'Tampilkan Semua Tindakan',
            onClick: onClearSearch,
            variant: 'secondary'
          }
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<DocumentTextIcon className="h-12 w-12" />}
      title="Belum ada tindakan"
      description="Mulai dengan menambahkan tindakan ICD-10 pertama"
      action={{
        label: 'Tambah Tindakan Pertama',
        onClick: onAddTindakan
      }}
    />
  );
}