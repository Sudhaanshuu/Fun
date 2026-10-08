import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { ShieldAlert, Ban } from 'lucide-react';

export const AcceptableUsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
          
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-2 text-rose-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Ethical Safety Policy</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Acceptable Use & Anti-Harassment Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Version 1.0 • Updated October 8, 2026</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">1. Strict Prohibitions</h2>
            <p>
              The TeleSim educational platform is engineered strictly for serverless software education and security architecture demonstrations. 
              The platform strictly forbids:
            </p>

            <ul className="space-y-2.5 pt-2">
              {[
                'Sending bulk SMS or initiating repeated call floods against real individuals',
                'Attempting to interface this simulator with external real-world GSM modems or SIP trunking gateways',
                'Caller ID spoofing or deceptive identification behaviors',
                'Scripted automated load testing without prior written authorization from SecOps',
                'Submitting unverified or third-party telephone numbers for harassing purposes',
                'Circumventing Cloudflare Turnstile token validation via headless automation'
              ].map((proh, pIdx) => (
                <li key={pIdx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{proh}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-bold text-slate-900 pt-4">2. Enforcement & Automatic Sentry</h2>
            <p>
              Our automated SecOps telemetry monitors all simulation requests for anomalous request frequency, repeated blocked Turnstile submissions, and suspicious IP rotations. 
              Violators are subjected to immediate account suspension and blacklisting across the Pixir edge network.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">3. Reporting Violations</h2>
            <p>
              If you suspect any unauthorized simulation or breach of this policy, please file an immediate report via our{' '}
              <a href="/report-abuse" className="text-rose-600 font-bold hover:underline">
                Abuse Reporting Desk
              </a>{' '}
              or email our Security Operations Desk at <code className="text-emerald-700 font-mono">abuse-disclosure@pixir.in</code>.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
