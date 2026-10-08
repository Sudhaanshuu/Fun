import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { isValidE164, maskPhoneNumber, computeHmac } from '../../lib/crypto';

export const InteractiveSandboxLookup: React.FC = () => {
  const [inputNumber, setInputNumber] = useState('+919876543210');
  const [analyzed, setAnalyzed] = useState<{
    raw: string;
    valid: boolean;
    masked: string;
    hmac: string;
    quotaStatus: string;
    riskScore: number;
  } | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = isValidE164(inputNumber);
    const masked = maskPhoneNumber(inputNumber);
    const hmac = await computeHmac('educational-preview-secret', inputNumber);

    setAnalyzed({
      raw: inputNumber,
      valid,
      masked,
      hmac,
      quotaStatus: '3 / 3 Daily Events Available',
      riskScore: valid ? 8 : 75,
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title matching screenshot search header */}
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Interactive Target <span className="text-emerald-600">Privacy & Sandbox</span> Lookup
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Test telephone format verification, inspect zero-knowledge HMAC-SHA256 digests, and preview sandbox quota policies.
        </p>

        {/* Pill Search Input Bar */}
        <form onSubmit={handleInspect} className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center bg-white rounded-full border border-slate-300 p-1.5 shadow-md shadow-emerald-500/5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
            <input
              type="text"
              value={inputNumber}
              onChange={e => setInputNumber(e.target.value)}
              placeholder="Enter test number with country code (e.g. +919876543210)..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-2"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition-all shrink-0"
            >
              Inspect
            </button>
          </div>
          <span className="text-[11px] text-slate-600 mt-2 block">
            Try: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">+919876543210</code> or <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">+12025550143</code>
          </span>
        </form>

        {/* Interactive Live Inspection Card */}
        {analyzed && (
          <div className="mt-8 bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm text-left max-w-2xl mx-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Synthetic Cryptographic Telemetry</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                analyzed.valid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {analyzed.valid ? 'E.164 Valid' : 'Format Invalid'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium block text-[11px]">Masked UI Display (Safe)</span>
                <span className="font-bold font-mono text-slate-800 text-sm mt-0.5 block">
                  {analyzed.masked}
                </span>
                <span className="text-[10px] text-slate-600 mt-1 block">Raw digits redacted for carrier privacy</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium block text-[11px]">Sandbox Quota Allowed</span>
                <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                  {analyzed.quotaStatus}
                </span>
                <span className="text-[10px] text-slate-600 mt-1 block">Per-target anti-flooding guard active</span>
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium block text-[11px]">Serverless Target HMAC Hash (One-Way Salted)</span>
                  <span className="text-[10px] text-emerald-600 font-mono">SHA-256</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-700 break-all bg-white p-2 rounded border border-slate-200">
                  {analyzed.hmac}
                </div>
                <span className="text-[10px] text-slate-600 mt-1 block">
                  Only this cryptographic hash is stored in database tables — zero raw phone exposure.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
