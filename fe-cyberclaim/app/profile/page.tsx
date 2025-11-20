// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import { Faskes, FaskesFormData } from '@/types/faskes';
import { User } from '@/types/users';
import { ProfileFormData } from '@/types/profile';
import { mockFaskes } from '@/lib/mock-data/faskes';
import { mockUsers } from '@/lib/mock-data/users';
import { ProfileHeader, FaskesInfoForm, UserInfoForm, ChangePasswordForm} from '@/components/Features/Profile';
import { updateFaskes, updateUserProfile, changePassword } from '@/lib/api/profile';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'faskes' | 'user' | 'password'>('faskes');
  const [faskes, setFaskes] = useState<Faskes | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulasi fetch data
    const currentFaskes = mockFaskes[0];
    const currentUser = mockUsers[0];
    setFaskes(currentFaskes);
    setUser(currentUser);
  }, []);

  const handleUpdateFaskes = async (formData: FaskesFormData) => {
    setLoading(true);
    try {
      // Simulasi API call
      await updateFaskes(formData);
      setFaskes(prev => prev ? { ...prev, ...formData } : null);
      alert('Data faskes berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update faskes:', error);
      alert('Gagal memperbarui data faskes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      // Simulasi API call
      await updateUserProfile(userData);
      setUser(prev => prev ? { ...prev, ...userData } : null);
      alert('Data profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Gagal memperbarui data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    setLoading(true);
    try {
      // Simulasi API call
      await changePassword(passwordData);
      alert('Password berhasil diubah!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  if (!faskes || !user) {
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <ProfileHeader 
            faskes={faskes}
            user={user}
          />

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan</h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('faskes')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'faskes'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span className="font-medium">Data Faskes</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('user')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'user'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5" />
                      <span className="font-medium">Profil User</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'password'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <LockClosedIcon className="w-5 h-5" />
                      <span className="font-medium">Ubah Password</span>
                    </div>
                  </button>
                </nav>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-900">Keamanan Akun</h4>
                      <p className="text-xs text-green-700 mt-1">
                        Pastikan data faskes dan password selalu diperbarui untuk keamanan akun Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                
                {/* Faskes Information Tab */}
                {activeTab === 'faskes' && (
                  <FaskesInfoForm
                    faskes={faskes}
                    onSubmit={handleUpdateFaskes}
                    loading={loading}
                  />
                )}

                {/* User Information Tab */}
                {activeTab === 'user' && (
                  <UserInfoForm
                    user={user}
                    onSubmit={handleUpdateUser}
                    loading={loading}
                  />
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                  <ChangePasswordForm
                    onSubmit={handleChangePassword}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Icon Components
const BuildingOfficeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);