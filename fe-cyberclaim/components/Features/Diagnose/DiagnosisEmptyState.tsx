// components/diagnosis/DiagnosisEmptyState.tsx
'use client';

import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common/EmptyState';

interface DiagnosisEmptyStateProps {
  onAddDiagnosis: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

export default function DiagnosisEmptyState({ 
  onAddDiagnosis, 
  hasSearch = false,
  onClearSearch 
}: DiagnosisEmptyStateProps) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon className="h-12 w-12" />}
        title="Diagnosis tidak ditemukan"
        description="Tidak ada diagnosis yang sesuai dengan pencarian Anda"
        action={
          onClearSearch && {
            label: 'Tampilkan Semua Diagnosis',
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
      title="Belum ada diagnosis"
      description="Mulai dengan menambahkan diagnosis ICD-9 pertama"
      action={{
        label: 'Tambah Diagnosis Pertama',
        onClick: onAddDiagnosis
      }}
    />
  );
}