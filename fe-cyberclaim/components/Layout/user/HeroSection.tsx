// components/Layout/HeroSection.tsx
export default function HeroSection() {
    return (
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  🚀 AI-Powered Claim Verification
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Revolusioner Sistem
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {' '}Verifikasi Klaim BPJS
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  CyberClaim mengotomatiskan proses verifikasi klaim BPJS dengan kecerdasan buatan, 
                  mengurangi waktu proses dari hari menjadi menit dengan akurasi 99.2%.
                </p>
              </div>
  
              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">98% Akurasi AI</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">90% Lebih Cepat</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Deteksi Fraud</span>
                </div>
              </div>
  
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lihat Demo
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  Pelajari Fitur
                </a>
              </div>
            </div>
  
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-linear-to-br from-blue-500 to-green-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">CyberClaim Dashboard</div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mock Dashboard */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">98%</div>
                        <div className="text-xs opacity-90">Accuracy</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">24/7</div>
                        <div className="text-xs opacity-90">Monitoring</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">99.9%</div>
                        <div className="text-xs opacity-90">Uptime</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span>Klaim Terverifikasi</span>
                        <span>1,248</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-green-300 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-200 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }