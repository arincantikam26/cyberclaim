// components/tarif/TarifEmptyState.tsx
'use client';

import { 
  DocumentChartBarIcon, 
  MagnifyingGlassIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common/EmptyState';

interface TarifEmptyStateProps {
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

export default function TarifEmptyState({ 
  hasSearch = false,
  onClearSearch 
}: TarifEmptyStateProps) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon className="h-16 w-16 text-gray-400" />}
        title="Tarif INA-CBGS tidak ditemukan"
        description="Tidak ada tarif yang sesuai dengan pencarian atau filter yang Anda terapkan"
        action={
          onClearSearch && {
            label: 'Tampilkan Semua Tarif',
            onClick: onClearSearch,
            variant: 'secondary'
          }
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<DocumentChartBarIcon className="h-16 w-16 text-gray-400" />}
      title="Belum ada tarif INA-CBGS"
      description="Tarif INA-CBGS akan terisi otomatis berdasarkan akumulasi diagnosis ICD-10 dan tindakan ICD-9 yang tersedia di sistem"
      action={{
        label: 'Pelajari Tentang INA-CBGS',
        onClick: () => window.open('https://www.bpjs-kesehatan.go.id/bpjs/', 'blank'),
        variant: 'primary'
      }}
    />
  );
}