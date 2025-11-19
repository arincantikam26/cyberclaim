// components/HowItWorksSection.tsx
export default function HowItWorksSection() {
    const steps = [
      {
        step: "01",
        title: "Upload Dokumen",
        description: "Faskes mengupload dokumen klaim melalui platform CyberClaim dengan drag & drop interface",
        icon: "📄"
      },
      {
        step: "02",
        title: "AI Processing",
        description: "Sistem AI menganalisis dokumen, memvalidasi kelengkapan, dan mengekstrak data penting",
        icon: "🤖"
      },
      {
        step: "03",
        title: "Validation & Coding",
        description: "Validasi otomatis kode INA-CBGs dan pengecekan konsistensi data medis",
        icon: "🔍"
      },
      {
        step: "04",
        title: "Fraud Detection",
        description: "Machine Learning menganalisis pola untuk mendeteksi potensi fraud dan anomaly",
        icon: "🛡️"
      },
      {
        step: "05",
        title: "Real-time Dashboard",
        description: "Hasil verifikasi tersedia di dashboard real-time dengan rekomendasi tindakan",
        icon: "📊"
      }
    ];
  
    return (
      <section id="how-it-works" className="py-20 bg-linear-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">CyberClaim</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proses verifikasi klaim yang sederhana namun powerful, mengubah proses manual yang rumit menjadi otomatis dan efisien
            </p>
          </div>
  
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500 hidden lg:block"></div>
  
            <div className="space-y-12 lg:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'} mb-8 lg:mb-0`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
  
                  {/* Icon Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg z-10 hidden lg:flex">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
  
                  {/* Spacer for even items */}
                  <div className="lg:w-1/2 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }