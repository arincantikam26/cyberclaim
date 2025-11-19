// components/CTASection.tsx
export default function CTASection() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Transformasi Proses Klaim BPJS Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Jadilah bagian dari revolusi digital kesehatan Indonesia. 
              Tingkatkan efisiensi, akurasi, dan keamanan proses klaim BPJS dengan CyberClaim.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🚀 Request Demo Gratis
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                📞 Hubungi Sales
              </a>
            </div>
  
            <div className="mt-8 text-blue-100 text-sm">
              ✅ Demo 30 menit • Tidak ada kewajiban • Setup dalam 24 jam
            </div>
          </div>
        </div>
      </section>
    );
  }