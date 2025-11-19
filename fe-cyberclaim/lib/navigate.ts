import { HomeIcon, DocumentArrowUpIcon, DocumentCheckIcon, UserGroupIcon, ShieldCheckIcon, HeartIcon, ChartBarIcon, CogIcon, UserIcon, BuildingOfficeIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export const navigation = [
    // Dashboard Group
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, group: 'main', roles: ['admin','superadmin','faskes'] },
  
    // Claims Management Group
    { name: 'Upload Klaim', href: '/claim', icon: DocumentArrowUpIcon, group: 'claims', roles: ['superadmin','admin'] },
    { name: 'Validasi Klaim', href: '/validation', icon: DocumentCheckIcon, group: 'claims', roles: ['superadmin','admin'] },
    { name: 'Verifikasi BPJS', href: '/verification', icon: UserGroupIcon, group: 'claims', roles: ['superadmin'] },
    { name: 'Fraud Detection', href: '/fraud', icon: ShieldCheckIcon, group: 'claims', roles: ['superadmin'] },
  
    // Master Data Group
    { name: 'Tindakan (ICD-9)', href: '/tindakan', icon: DocumentCheckIcon, group: 'master-data', roles: ['superadmin'] },
    { name: 'Diagnosa (ICD-10)', href: '/diagnosa', icon: HeartIcon, group: 'master-data', roles: ['superadmin'] },
    { name: 'Tarif Tindakan', href: '/tarif', icon: ChartBarIcon, group: 'master-data', roles: ['superadmin'] },
    { name: 'Faskes', href: '/faskes', icon: BuildingOfficeIcon, group: 'master-data', roles: ['superadmin'] },
    { name: 'Dokter', href: '/doctor', icon: UserCircleIcon, group: 'master-data', roles: ['superadmin','admin'] },
    { name: 'Pasien', href: '/patient', icon: UserIcon, group: 'master-data', roles: ['admin'] },
  
    // Administration Group
    { name: 'Manajemen User', href: '/users', icon: UserIcon, group: 'admin', roles: ['superadmin'] },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, group: 'admin', roles: ['superadmin','admin'] },
    { name: 'Update Profile', href: '/profile', icon: CogIcon, group: 'admin', roles: ['admin','superadmin','faskes'] },
  ];
  