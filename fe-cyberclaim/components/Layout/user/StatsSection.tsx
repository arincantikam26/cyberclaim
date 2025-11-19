// components/StatsSection.tsx
export default function StatsSection() {
    return (
      <section id="stats" className="py-20 bg-linear-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dalam Angka: <span className="bg-linear-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Impact CyberClaim</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Bukti nyata transformasi digital dalam ekosistem kesehatan Indonesia
            </p>
          </div>
  
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">98.2%</div>
              <div className="text-blue-200">Accuracy Rate</div>
              <div className="text-sm text-gray-400 mt-1">AI Document Verification</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-blue-200">Real-time Monitoring</div>
              <div className="text-sm text-gray-400 mt-1">System Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">45x</div>
              <div className="text-blue-200">Faster Processing</div>
              <div className="text-sm text-gray-400 mt-1">Compared to Manual</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-blue-200">Uptime SLA</div>
              <div className="text-sm text-gray-400 mt-1">Enterprise Grade</div>
            </div>
          </div>
  
          {/* Security Badges */}
          <div className="mt-16 text-center">
            <p className="text-blue-200 mb-8">Tersertifikasi dan Didukung Oleh</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="bg-white/10 rounded-xl px-6 py-3 text-sm">ISO 27001</div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-sm">HIPAA Compliant</div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-sm">Kemenkes Certified</div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-sm">BPJS Partner</div>
            </div>
          </div>
        </div>
      </section>
    );
  }