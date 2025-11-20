// components/doctors/DoctorsEmptyState.tsx
'use client';

import { UserIcon } from '@heroicons/react/24/outline';

interface DoctorsEmptyStateProps {
  onAddDoctor: () => void;
}

export default function DoctorsEmptyState({ onAddDoctor }: DoctorsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum ada dokter</h3>
      <p className="mt-2 text-gray-500">
        Mulai dengan menambahkan dokter pertama Anda
      </p>
      <button
        onClick={onAddDoctor}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold"
      >
        Tambah Dokter Pertama
      </button>
    </div>
  );
}