// components/users/UserListView.tsx
'use client';

import { User } from '@/types/users';
import { DataList } from '@/components/common/DataList';
import UserCard from './UserCard';
import UsersEmptyState from './UsersEmptyState';
import { ActionButtons } from '@/components/common/ActionButtons';
import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Mock data untuk facilities dan roles
const mockFacilities: Record<string, string> = {
  'faskes-1': 'Klinik Utama Jakarta',
  'faskes-2': 'Klinik Cabang Bandung', 
  'faskes-3': 'Klinik Cabang Surabaya'
};

const mockRoles: Record<string, string> = {
  'role-1': 'Administrator',
  'role-2': 'Dokter',
  'role-3': 'Perawat',
  'role-4': 'Front Desk',
  'role-5': 'Staff Administrasi'
};

interface UserListViewProps {
  users: User[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function UserListView({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  deleteLoading, 
  loading = false 
}: UserListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getLastLoginText = (user: User) => {
    if (!user.last_login) return 'Belum login';
    
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hari ini';
    if (diffDays <= 7) return `${diffDays} hari lalu`;
    return formatDate(user.last_login);
  };

  const getRoleBadgeColor = (roleId: string): string => {
    switch (roleId) {
      case 'role-1': return 'bg-purple-100 text-purple-800';
      case 'role-2': return 'bg-blue-100 text-blue-800';
      case 'role-3': return 'bg-green-100 text-green-800';
      case 'role-4': return 'bg-yellow-100 text-yellow-800';
      case 'role-5': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DataList
      data={users}
      columns={[
        {
          key: 'name',
          label: 'User',
          width: 'auto',
          render: (value, user: User) => (
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>
          )
        },
        {
          key: 'contact',
          label: 'Kontak',
          width: 'auto',
          render: (value, user: User) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          )
        },
        {
          key: 'facility',
          label: 'Fasilitas',
          width: 'auto',
          render: (value, user: User) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>{mockFacilities[user.facility_id] || 'Unknown'}</span>
              </div>
            </div>
          )
        },
        {
          key: 'role',
          label: 'Role',
          width: 'auto',
          render: (value, user: User) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role_id)}`}>
              {mockRoles[user.role_id]}
            </span>
          )
        },
        {
          key: 'last_login',
          label: 'Terakhir Login',
          width: 'auto',
          render: (value, user: User) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{getLastLoginText(user)}</span>
              </div>
            </div>
          )
        },
        {
          key: 'status',
          label: 'Status',
          width: '32',
          render: (value, user: User) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user.is_active ? 'Aktif' : 'Tidak Aktif'}
            </span>
          )
        },
        {
          key: 'actions',
          label: 'Aksi',
          width: '32',
          className: 'text-right',
          render: (value, user: User) => (
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => onToggleStatus(user.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  user.is_active
                    ? 'text-orange-400 hover:text-orange-600 hover:bg-orange-50'
                    : 'text-green-400 hover:text-green-600 hover:bg-green-50'
                }`}
                title={user.is_active ? 'Nonaktifkan User' : 'Aktifkan User'}
              >
                {user.is_active ? <UserOffIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </button>
              <ActionButtons
                onEdit={() => onEdit(`/dashboard/users/${user.id}/edit`)}
                onDelete={() => onDelete(user.id)}
                deleteLoading={deleteLoading === user.id}
                size="sm"
              />
            </div>
          )
        }
      ]}
      emptyState={
        <UsersEmptyState 
          onAddUser={() => window.location.href = '/dashboard/users/create'}
        />
      }
      loading={loading}
    />
  );
}

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);