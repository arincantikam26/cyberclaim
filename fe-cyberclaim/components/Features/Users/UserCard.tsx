// components/users/UserCard.tsx (Updated)
'use client';

import { User } from '@/types/users';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { DataCard } from '@/components/common/DataCard';
import { ActionButtons } from '@/components/common/ActionButtons';

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

interface UserCardProps {
  user: User;
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  deleteLoading: string | null;
  viewType: 'grid' | 'list';
}

export default function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  deleteLoading, 
  viewType 
}: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLastLoginText = () => {
    if (!user.last_login) return 'Belum pernah login';
    
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Login hari ini';
    if (diffDays <= 7) return `Login ${diffDays} hari yang lalu`;
    return `Login ${formatDate(user.last_login)}`;
  };

  // Grid View menggunakan DataCard reusable
  if (viewType === 'grid') {
    return (
      <DataCard
        data={user}
        title={user.full_name}
        subtitle={`@${user.username}`}
        badge={{
          text: mockRoles[user.role_id] || 'Unknown Role',
          color: getRoleColor(user.role_id)
        }}
        status={{
          isActive: user.is_active,
          activeText: 'Aktif',
          inactiveText: 'Tidak Aktif'
        }}
        fields={[
          {
            icon: <EnvelopeIcon />,
            label: 'Email',
            value: user.email,
            truncate: true
          },
          {
            icon: <BuildingOfficeIcon />,
            label: 'Faskes',
            value: mockFacilities[user.facility_id] || 'Unknown Facility',
            truncate: true
          },
          {
            icon: <ShieldCheckIcon />,
            label: 'Role',
            value: mockRoles[user.role_id] || 'Unknown Role'
          },
          {
            icon: <CalendarIcon />,
            label: 'Terakhir Login',
            value: getLastLoginText(),
            truncate: true
          }
        ]}
        actions={
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleStatus(user.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                user.is_active
                  ? 'text-orange-400 hover:text-orange-600 hover:bg-orange-50'
                  : 'text-green-400 hover:text-green-600 hover:bg-green-50'
              }`}
              title={user.is_active ? 'Nonaktifkan User' : 'Aktifkan User'}
            >
              {user.is_active ? <UserOffIcon className="w-4 h-4" /> : <UserOnIcon className="w-4 h-4" />}
            </button>
            <ActionButtons
              onEdit={() => onEdit(`/dashboard/users/${user.id}/edit`)}
              onDelete={() => onDelete(user.id)}
              deleteLoading={deleteLoading === user.id}
            />
          </div>
        }
      />
    );
  }

  // List View
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{mockFacilities[user.facility_id]}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role_id)}`}>
          {mockRoles[user.role_id]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {getLastLoginText()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            {user.is_active ? <UserOffIcon className="w-4 h-4" /> : <UserOnIcon className="w-4 h-4" />}
          </button>
          <ActionButtons
            onEdit={() => onEdit(`/dashboard/users/${user.id}/edit`)}
            onDelete={() => onDelete(user.id)}
            deleteLoading={deleteLoading === user.id}
            size="sm"
          />
        </div>
      </td>
    </tr>
  );
}

// Helper functions
function getRoleColor(roleId: string): 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' {
  switch (roleId) {
    case 'role-1': return 'purple'; // Admin
    case 'role-2': return 'blue';   // Dokter
    case 'role-3': return 'green';  // Perawat
    case 'role-4': return 'yellow'; // Front Desk
    case 'role-5': return 'gray';   // Staff
    default: return 'gray';
  }
}

function getRoleBadgeColor(roleId: string): string {
  switch (roleId) {
    case 'role-1': return 'bg-purple-100 text-purple-800';
    case 'role-2': return 'bg-blue-100 text-blue-800';
    case 'role-3': return 'bg-green-100 text-green-800';
    case 'role-4': return 'bg-yellow-100 text-yellow-800';
    case 'role-5': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

const UserOnIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);