// app/layout.tsx (Root Layout)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CyberClaim - AI Powered BPJS Claim Verification System',
  description: 'Sistem verifikasi klaim BPJS berbasis kecerdasan buatan yang mengotomatiskan pengecekan dokumen, validasi rekam medis, dan deteksi fraud dengan teknologi NLP dan machine learning.',
  keywords: 'BPJS, klaim, AI, verifikasi, kesehatan, fraud detection, INA-CBGs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}