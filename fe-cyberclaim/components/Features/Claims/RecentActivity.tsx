// components/Dashboard/RecentActivity.tsx
export default function RecentActivity() {
    const activities = [
      {
        type: 'upload',
        message: 'RS Mitra Sehat mengupload 5 dokumen klaim baru',
        time: '5 menit lalu',
        user: 'Admin RS Mitra'
      },
      {
        type: 'validation',
        message: 'Klaim CLM-2024-001 berhasil divalidasi',
        time: '15 menit lalu',
        user: 'AI System'
      },
      {
        type: 'approval',
        message: 'Klaim sebesar Rp 2.5M disetujui',
        time: '1 jam lalu',
        user: 'Verifikator BPJS'
      },
      {
        type: 'fraud',
        message: 'Potensi fraud terdeteksi pada klaim CLM-2024-003',
        time: '2 jam lalu',
        user: 'Fraud Detection'
      }
    ];
  
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'upload':
          return (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          );
        case 'validation':
          return (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'approval':
          return (
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          );
        case 'fraud':
          return (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <span className="text-xs text-blue-600 font-medium">{activity.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }