// components/users/UsersEmptyState.tsx
'use client';

import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common/EmptyState';

interface UsersEmptyStateProps {
  onAddUser: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

export default function UsersEmptyState({ 
  onAddUser, 
  hasSearch = false,
  onClearSearch 
}: UsersEmptyStateProps) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={<MagnifyingGlassIcon className="h-12 w-12" />}
        title="User tidak ditemukan"
        description="Tidak ada user yang sesuai dengan pencarian atau filter Anda"
        action={
          onClearSearch && {
            label: 'Tampilkan Semua User',
            onClick: onClearSearch,
            variant: 'secondary'
          }
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<UserIcon className="h-12 w-12" />}
      title="Belum ada user"
      description="Mulai dengan menambahkan user pertama ke sistem"
      action={{
        label: 'Tambah User Pertama',
        onClick: onAddUser
      }}
    />
  );
}