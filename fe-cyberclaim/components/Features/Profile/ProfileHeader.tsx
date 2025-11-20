// components/profile/ProfileHeader.tsx
'use client';

import { Faskes } from '@/types/faskes';
import { User } from '@/types/user';

interface ProfileHeaderProps {
  faskes: Faskes;
  user: User;
}

export default function ProfileHeader({ faskes, user }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <BuildingOfficeIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  faskes.operasional 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {faskes.operasional ? 'Aktif' : 'Nonaktif'}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-white">
              <h1 className="text-2xl lg:text-3xl font-bold">{faskes.name}</h1>
              <p className="text-blue-100 mt-1">{faskes.code}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center space-x-2 text-sm">
                  <UserCircleIcon className="w-4 h-4" />
                  <span>{user.full_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{faskes.city}, {faskes.province}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 lg:mt-0 flex flex-col items-end">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
              <div className="text-white text-sm font-semibold">Last Login</div>
              <div className="text-blue-100 text-sm">
                {user.last_login ? new Date(user.last_login).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Belum pernah login'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon Components for ProfileHeader
const BuildingOfficeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EnvelopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);