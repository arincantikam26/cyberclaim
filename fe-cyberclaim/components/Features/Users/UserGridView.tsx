// components/users/UserGridView.tsx
'use client';

import { User } from '@/types/users';
import { DataGrid } from '@/components/common/DataGrid';
import UserCard from './UserCard';
import UsersEmptyState from './UsersEmptyState';

interface UserGridViewProps {
  users: User[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function UserGridView({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  deleteLoading, 
  loading = false 
}: UserGridViewProps) {
  return (
    <DataGrid
      data={users}
      renderItem={(user) => (
        <UserCard
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          deleteLoading={deleteLoading}
          viewType="grid"
        />
      )}
      emptyState={
        <UsersEmptyState 
          onAddUser={() => window.location.href = '/dashboard/users/create'}
        />
      }
      loading={loading}
      columns={3}
      gap="md"
    />
  );
}