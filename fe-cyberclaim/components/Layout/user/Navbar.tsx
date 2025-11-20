// components/Layout/Homepage/EnhancedNavbar.tsx
'use client';

import { useState } from 'react';
import { useActiveSection } from './UseActiveSession';

export default function EnhancedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const sectionIds = ['features', 'how-it-works', 'benefits', 'stats', 'cta'];
  const activeSection = useActiveSection(sectionIds);

  const navItems = [
    { id: 'features', label: 'Fitur', href: '#features' },
    { id: 'how-it-works', label: 'Cara Kerja', href: '#how-it-works' },
    { id: 'benefits', label: 'Keuntungan', href: '#benefits' },
    { id: 'stats', label: 'Statistik', href: '#stats' },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNavItemClass = (sectionId: string) => {
    const baseClasses = "transition-all duration-300 font-medium relative";
    const isActive = activeSection === sectionId;
    
    if (isActive) {
      return `${baseClasses} text-blue-600 font-semibold`;
    }
    
    return `${baseClasses} text-gray-700 hover:text-blue-600`;
  };

  const getActiveIndicator = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    
    return isActive ? (
      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-blue-500 to-green-500 rounded-full"></div>
    ) : null;
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                CyberClaim
              </span>
              <div className="text-xs text-gray-500 -mt-1">by HealthTech</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={getNavItemClass(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                {item.label}
                {getActiveIndicator(item.id)}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Masuk
            </a>
            <a
              href="/demo"
              className="bg-linear-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              Request Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${getNavItemClass(item.id)} py-2 border-l-4 ${
                    activeSection === item.id 
                      ? 'border-blue-500 bg-blue-50 pl-4' 
                      : 'border-transparent pl-5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <a
                  href="/auth/login"
                  className="block text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk
                </a>
                <a
                  href="/demo"
                  className="block bg-linear-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-xl text-center hover:shadow-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}