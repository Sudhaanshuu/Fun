import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Lock, Key } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
          
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-2">
              <Lock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Privacy by Design</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & Zero-Knowledge Hashing</h1>
            <p className="text-xs text-slate-500 mt-1">Version 1.0 • Updated October 8, 2026</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">1. Zero Raw Telephone Storage Policy</h2>
            <p>
              Privacy is an immutable architectural invariant of the TeleSim platform. 
              <strong> We never store raw telephone numbers on physical disk, in PostgreSQL databases, in Redis caches, or within audit logs.</strong>
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 block flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>HMAC-SHA256 Target Hashing Specification</span>
              </span>
              <p className="text-xs text-emerald-950 font-mono">
                target_hash = HMAC_SHA256(server_salt_secret, E164_normalize(target_number))
              </p>
              <p className="text-xs text-emerald-900">
                This one-way cryptographic transformation allows the serverless rate limiter to identify duplicate requests 
                and calculate daily anti-abuse quotas without possessing the plain-text phone number.
              </p>
            </div>

            <h2 className="text-lg font-bold text-slate-900">2. Google OAuth & Identity Data</h2>
            <p>
              When signing in with Google OAuth, we capture solely your email address, display name, and avatar image URI. 
              This data is governed by Supabase PostgreSQL Row Level Security (RLS) ensuring that your simulation history is strictly private to your verified UUID.
            </p>

            <h2 className="text-lg font-bold text-slate-900">3. Anonymized Telemetry & Consent Hashes</h2>
            <p>
              Consent verification records record SHA-256 hashes of client IP addresses and User-Agent headers for compliance auditability. 
              Raw client IP addresses are discarded at Cloudflare Worker boundary.
            </p>

            <h2 className="text-lg font-bold text-slate-900">4. Right to Erasure (GDPR & CCPA)</h2>
            <p>
              You maintain total sovereignty over your personal data. At any time, you may navigate to <strong>/account</strong> to download a complete JSON export of your personal data or execute a permanent account deletion command.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
