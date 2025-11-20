// components/patients/PatientsEmptyState.tsx
'use client';

import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common/EmptyState';

interface PatientsEmptyStateProps {
  onAddPatient: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

export default function PatientsEmptyState({ 
  onAddPatient, 
  hasSearch = false,
  onClearSearch 
}: PatientsEmptyStateProps) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon className="h-12 w-12" />}
        title="Pasien tidak ditemukan"
        description="Tidak ada pasien yang sesuai dengan pencarian Anda"
        action={
          onClearSearch && {
            label: 'Tampilkan Semua Pasien',
            onClick: onClearSearch
          }
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<UserIcon className="h-12 w-12" />}
      title="Belum ada pasien"
      description="Mulai dengan menambahkan pasien pertama Anda"
      action={{
        label: 'Tambah Pasien Pertama',
        onClick: onAddPatient
      }}
    />
  );
}