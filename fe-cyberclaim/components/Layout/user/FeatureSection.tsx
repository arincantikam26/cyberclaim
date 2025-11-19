// components/FeaturesSection.tsx
export default function FeaturesSection() {
    const features = [
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        title: "AI Document Auto-Verification",
        description: "Memeriksa berkas klinis dan administratif secara otomatis, mendeteksi ketidaksesuaian data, serta memberikan rekomendasi perbaikan real-time.",
        color: "blue"
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
        title: "Intelligent Coding Validation",
        description: "Memvalidasi kode layanan, prosedur, dan tarif INA-CBGs secara otomatis untuk mengurangi risiko klaim pending dan kesalahan koding.",
        color: "green"
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        title: "Fraud Pattern Recognition",
        description: "Menganalisis pola klaim berulang atau diagnosis tidak wajar dengan machine learning dan memberikan risk scoring untuk deteksi dini fraud.",
        color: "purple"
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        title: "Real-time Claim Monitoring",
        description: "Dashboard real-time yang menampilkan status klaim, potensi kendala, dan risiko secara transparan bagi faskes dan BPJS.",
        color: "orange"
      }
    ];
  
    const getColorClasses = (color: string) => {
      const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600'
      };
      return colors[color as keyof typeof colors] || colors.blue;
    };
  
    return (
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan <span className="bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">CyberClaim</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Didukung oleh teknologi AI terkini, CyberClaim memberikan solusi komprehensif 
              untuk transformasi digital proses verifikasi klaim BPJS
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-linear-to-br from-white to-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200"
              >
                <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
  
          {/* Technology Stack */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-8">Didukung oleh teknologi terkini</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">NLP</div>
              <div className="text-2xl font-bold text-gray-400">Machine Learning</div>
              <div className="text-2xl font-bold text-gray-400">Computer Vision</div>
              <div className="text-2xl font-bold text-gray-400">Blockchain</div>
              <div className="text-2xl font-bold text-gray-400">Cloud AI</div>
            </div>
          </div>
        </div>
      </section>
    );
  }