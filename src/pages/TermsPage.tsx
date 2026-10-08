import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
          
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Platform Governance</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions of Service</h1>
            <p className="text-xs text-slate-500 mt-1">Version 1.0 • Effective Date: October 8, 2026</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">1. Nature of the Service</h2>
            <p>
              The TeleSim Learning Platform provided under app.pixir.in is an educational computing environment engineered to demonstrate serverless telecommunications job pipelines.
              <strong> Under no circumstances does this application communicate with external public switched telephone networks (PSTN), SS7 networks, cellular towers, or real mobile subscribers.</strong>
            </p>

            <h2 className="text-lg font-bold text-slate-900">2. User Eligibility & Mandatory Consent</h2>
            <p>
              Access to simulation dispatch APIs is restricted to authenticated users who have cryptographically agreed to the Responsible Use Agreement. 
              Attempts to falsify consent records, bypass Cloudflare Turnstile bot challenges, or utilize automated scraping tools will result in account suspension and IP hash banning.
            </p>

            <h2 className="text-lg font-bold text-slate-900">3. Rate Limiting & Cooldown Enforcements</h2>
            <p>
              Users agree to strictly adhere to platform rate limits: maximum 5 simulations per hour per user, maximum 3 simulations per 24 hours per target hash, and 1 concurrent simulation job per session. 
              Exceeding these limits is automatically suppressed by application-level rate meters.
            </p>

            <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>
              The platform and its operators provide all synthetic telemetry "as is" without warranty of carrier interoperability. 
              The service is intended exclusively for systems research, architectural demonstrations, and developer education.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
