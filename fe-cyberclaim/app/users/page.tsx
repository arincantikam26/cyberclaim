// app/dashboard/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { User } from '@/types/users';
import { getUsers, deleteUser, toggleUserStatus, getUserStats } from '@/lib/api/users';
import {
  UserGridView,
  UserListView,
  UsersEmptyState,
  ViewToggle,
  UsersPagination
} from '@/components/Features/Users';
import { ViewType } from '@/components/common/ViewToggle';

// Constants
const ITEMS_PER_PAGE = 9;

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, searchTerm, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
      });
      
      setUsers(data.data);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats({
        total: statsData.total,
        active: statsData.active,
        inactive: statsData.inactive
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteUser(id);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Gagal menghapus user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Gagal mengubah status user');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleViewChange = (newViewType: ViewType) => {
    setViewType(newViewType);
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
            <p className="text-gray-600 mt-2">
              Kelola semua user yang memiliki akses ke sistem
              {totalUsers > 0 && (
                <span className="text-blue-600 font-semibold"> ({totalUsers} user)</span>
              )}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <ViewToggle 
              viewType={viewType} 
              onViewChange={handleViewChange} 
            />
            <button
              onClick={() => router.push('/dashboard/users/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ActiveUsersIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <InactiveUsersIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-6">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari user berdasarkan username, nama, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Cari
              </button>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold flex items-center"
                >
                  <ResetIcon className="w-5 h-5 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* View Info Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {viewType === 'grid' ? 'Tampilan Grid' : 'Tampilan List'}
          {searchTerm && (
            <span className="ml-2 text-blue-600">
              • Pencarian: "{searchTerm}"
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="ml-2 text-blue-600">
              • Status: {statusFilter === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </span>
          )}
        </div>
        
        {/* Mobile View Toggle */}
        <div className="lg:hidden">
          <ViewToggle 
            viewType={viewType} 
            onViewChange={handleViewChange}
            size="sm"
          />
        </div>
      </div>

      {/* Users Content */}
      {users.length === 0 ? (
        <UsersEmptyState 
          onAddUser={() => router.push('/dashboard/users/create')}
          hasSearch={!!searchTerm || statusFilter !== 'all'}
          onClearSearch={clearSearch}
        />
      ) : (
        <>
          {viewType === 'grid' ? (
            <UserGridView 
              users={users} 
              onEdit={router.push} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              deleteLoading={deleteLoading} 
              loading={loading}
            />
          ) : (
            <UserListView 
              users={users} 
              onEdit={router.push} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              deleteLoading={deleteLoading} 
              loading={loading}
            />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <UsersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUsers}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

// Icon Components
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ResetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ActiveUsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InactiveUsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);