// components/Dashboard/QuickActions.tsx
export default function QuickActions() {
    const actions = [
      {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Upload Klaim',
        description: 'Upload dokumen klaim baru',
        color: 'bg-blue-500',
        href: '/dashboard/upload'
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        label: 'Validasi',
        description: 'Proses validasi klaim',
        color: 'bg-green-500',
        href: '/dashboard/validation'
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        label: 'Fraud Check',
        description: 'Deteksi potensi fraud',
        color: 'bg-red-500',
        href: '/dashboard/fraud'
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        label: 'Laporan',
        description: 'Generate laporan',
        color: 'bg-purple-500',
        href: '/dashboard/analytics'
      }
    ];
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-900 text-sm text-center mb-1">
                {action.label}
              </span>
              <span className="text-xs text-gray-500 text-center">
                {action.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }