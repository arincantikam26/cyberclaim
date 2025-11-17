// pages/dashboard.tsx
import AdminLayout from '@/components/Layout/AdminLayout';
import StatCard from '@/components/Layout/StatCard';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const stats = [
    {
      title: 'Jumlah Faskes',
      value: '1,248',
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'BPJS Member',
      value: '45.2K',
      icon: UserGroupIcon,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Validasi Open',
      value: '342',
      icon: DocumentCheckIcon,
      color: 'bg-yellow-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Validasi Close',
      value: '1,892',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Validasi Pending',
      value: '89',
      icon: ClockIcon,
      color: 'bg-orange-500',
      change: '-3%',
      trend: 'down'
    }
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Faskes</h1>
        <p className="text-gray-600 mt-2">Monitor semua aktivitas klaim BPJS secara real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
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

        {/* AI Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Document Auto-Verification</h3>
              <p className="text-sm text-blue-800">98.2% dokumen terverifikasi otomatis</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98.2%' }}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Fraud Detection Accuracy</h3>
              <p className="text-sm text-green-800">94.5% akurasi deteksi anomaly</p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Coding Validation</h3>
              <p className="text-sm text-purple-800">96.8% kode INA-CBGs valid</p>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}