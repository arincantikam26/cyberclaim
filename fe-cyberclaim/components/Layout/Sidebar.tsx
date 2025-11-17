// components/Layout/Sidebar.tsx
import { useRouter } from 'next/navigation';

import {
  HomeIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Upload Dokumen', href: '/upload', icon: DocumentArrowUpIcon },
  { name: 'Validasi Klaim', href: '/validation', icon: DocumentCheckIcon },
  { name: 'Fraud Detection', href: '/fraud', icon: ShieldCheckIcon },
  { name: 'Verifikasi BPJS', href: '/verification', icon: UserGroupIcon },
  { name: 'Manajemen User', href: '/users', icon: UserIcon },
  { name: 'Update Profile', href: '/profile', icon: CogIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-green-900 transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-white bg-opacity-10">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-black" />
            <span className="text-black text-xl font-bold">CyberClaim</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-white bg-opacity-20 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-black'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
          <div className="flex items-center space-x-3 text-blue-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs truncate">admin@cyberclaim.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}