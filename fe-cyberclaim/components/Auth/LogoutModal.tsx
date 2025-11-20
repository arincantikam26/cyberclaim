// components/auth/LogoutModal.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ExclamationTriangleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Konfirmasi Logout</h2>
              <p className="text-red-100 text-sm">Anda akan keluar dari sistem</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <ShieldExclamationIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Keamanan Akun</h4>
              <p className="text-sm text-blue-700 mt-1">
                Pastikan Anda telah menyimpan semua pekerjaan sebelum logout dari sistem.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Sesi akan diakhiri dengan aman</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Data tersimpan secara otomatis</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Anda dapat login kembali kapan saja</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
          >
            Batalkan
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging Out...
              </>
            ) : (
              <>
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Ya, Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Icon Components
const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const ShieldExclamationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);