import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { QuickCards } from '../components/landing/QuickCards';
import { StatsCounter } from '../components/landing/StatsCounter';
import { ArchitectureServices } from '../components/landing/ArchitectureServices';
import { InteractiveSandboxLookup } from '../components/landing/InteractiveSandboxLookup';
import { EdgeMapSection } from '../components/landing/EdgeMapSection';
import { NewsScroller } from '../components/landing/NewsScroller';
import { ContactAbuseSection } from '../components/landing/ContactAbuseSection';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <KillSwitchBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuickCards />
        <StatsCounter />
        <ArchitectureServices />
        <InteractiveSandboxLookup />
        <EdgeMapSection />
        <NewsScroller />
        <ContactAbuseSection />
      </main>
      <Footer />
    </div>
  );
};
