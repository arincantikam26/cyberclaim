// app/page.tsx (Homepage)
import Navbar from '@/components/Layout/user/Navbar';
import HeroSection from '@/components/Layout/user/HeroSection';
import FeaturesSection from '@/components/Layout/user/FeatureSection';
import HowItWorksSection from '@/components/Layout/user/HowItWorksSection';
import BenefitsSection from '@/components/Layout/user/BenefitsSection';
import StatsSection from '@/components/Layout/user/StatsSection';
import CTASection from '@/components/Layout/user/CTASection';
import Footer from '@/components/Layout/user/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-green-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}