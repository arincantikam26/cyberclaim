// components/BenefitsSection.tsx
export default function BenefitsSection() {
    const benefits = [
      {
        metric: "90%",
        title: "Pengurangan Waktu Proses",
        description: "Dari rata-rata 14 hari menjadi kurang dari 24 jam"
      },
      {
        metric: "98%",
        title: "Akurasi Verifikasi",
        description: "Tingkat akurasi AI dalam mendeteksi kesalahan dan ketidaksesuaian"
      },
      {
        metric: "75%",
        title: "Pengurangan Biaya Operasional",
        description: "Efisiensi biaya administrasi dan tenaga kerja"
      },
      {
        metric: "99.9%",
        title: "System Uptime",
        description: "Ketersediaan sistem 24/7 dengan redundansi tinggi"
      }
    ];
  
    return (
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hasil Nyata dengan <span className="bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">CyberClaim</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformasi digital yang memberikan impact langsung pada efisiensi dan akurasi proses klaim BPJS
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-linear-to-br from-blue-500 to-green-500 text-white rounded-2xl p-8 shadow-lg">
                  <div className="text-4xl font-bold mb-2">{benefit.metric}</div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          {/* Additional Info */}
          <div className="mt-16 bg-linear-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-700">Faskes Terdaftar</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">1.2M+</div>
                <div className="text-gray-700">Klaim Terproses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-2">Rp 2.1T</div>
                <div className="text-gray-700">Nilai Klaim Tervalidasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }