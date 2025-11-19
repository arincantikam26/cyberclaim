// pages/dashboard.tsx
import AdminLayout from '@/components/Layout/admin/AdminLayout';
import StatCard from '@/components/Layout/admin/StatCard';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {


  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-2">Monitor semua aktivitas klaim BPJS secara real-time</p>
      </div>

      {/* Main Content Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {[
              { type: 'upload', message: 'RS Mitra Sehat mengupload 12 dokumen klaim', time: '5 menit lalu' },
              { type: 'validation', message: 'Validasi otomatis layer 1 selesai - 98% accuracy', time: '15 menit lalu' },
              { type: 'fraud', message: 'Fraud detection menemukan 3 pola mencurigakan', time: '1 jam lalu' },
              { type: 'approval', message: 'Klaim RS Siloam disetujui - Rp 245 juta', time: '2 jam lalu' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'upload' ? 'bg-blue-500' :
                  activity.type === 'validation' ? 'bg-green-500' :
                  activity.type === 'fraud' ? 'bg-red-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </AdminLayout>
  );
}