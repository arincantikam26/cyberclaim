// components/Layout/Dashboard/NavigationConfig.ts
export type UserRole = 'superadmin' | 'admin' | 'faskes';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  roles: UserRole[]; // Roles yang boleh akses
}

export const navigationConfig: NavigationItem[] = [
  // Superadmin only
  {
    name: 'Manajemen User',
    href: '/dashboard/users',
    icon: UserIcon,
    roles: ['superadmin']
  },
  
  // Superadmin & Admin
  {
    name: 'Upload Dokumen',
    href: '/dashboard/upload',
    icon: DocumentArrowUpIcon,
    roles: ['superadmin', 'admin']
  },
  
  // Semua role
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['superadmin', 'admin', 'faskes']
  },
  {
    name: 'Validasi Klaim',
    href: '/dashboard/validation',
    icon: DocumentCheckIcon,
    roles: ['superadmin', 'admin', 'faskes']
  },
  {
    name: 'Update Profile',
    href: '/dashboard/profile',
    icon: CogIcon,
    roles: ['superadmin', 'admin', 'faskes']
  },
  
  // Superadmin & faskes
  {
    name: 'Fraud Detection',
    href: '/dashboard/fraud',
    icon: ShieldCheckIcon,
    roles: ['superadmin', 'faskes']
  },
  
  // faskes only
  {
    name: 'Verifikasi BPJS',
    href: '/dashboard/verification',
    icon: UserGroupIcon,
    roles: ['faskes']
  },
  
  // Semua role
  {
    name: 'INA-CBGs',
    href: '/dashboard/inacbgs',
    icon: ChartBarIcon,
    roles: ['superadmin', 'admin', 'faskes']
  },
];