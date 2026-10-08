import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, FileText, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ConsentModalProps {
  isOpen: boolean;
  onConsentAccepted: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onConsentAccepted }) => {
  const { recordConsent } = useAuth();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeTestingOnly, setAgreeTestingOnly] = useState(false);
  const [agreeSuspension, setAgreeSuspension] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'terms' | 'acceptable' | 'privacy'>('summary');

  if (!isOpen) return null;

  const allAgreed = agreeTerms && agreeTestingOnly && agreeSuspension;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) return;
    recordConsent();
    onConsentAccepted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Mandatory Responsible Use Agreement</h2>
              <p className="text-xs text-emerald-100">Educational Telecom Simulation Sandbox — Version 1.0</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-500/30 px-2.5 py-1 rounded-full font-medium border border-white/20">
            Audit Enforced
          </span>
        </div>

        {/* Informational Callout */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-start space-x-2.5 text-xs text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p>
            <strong>Simulated Telecommunications Notice:</strong> This platform is purely for serverless architectural education. 
            All voice calls and SMS packets remain inside an isolated synthetic engine. <strong>No real phone numbers are ever dialed or messaged.</strong>
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 px-5 pt-2 space-x-2 bg-slate-50 text-xs">
          {[
            { id: 'summary', label: 'Overview' },
            { id: 'acceptable', label: 'Acceptable Use Policy' },
            { id: 'privacy', label: 'Privacy & Zero-Knowledge' },
            { id: 'terms', label: 'Terms & Conditions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed flex-1 bg-white">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Welcome to the TeleSim Learning Sandbox</h3>
              <p>
                To maintain ethical standards and comply with international telecommunications and cyber-safety regulations, 
                all users must verify their adherence to the Responsible Use Framework before dispatching simulated tasks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1">Strict Rate Capping</span>
                  <p className="text-[11px] text-slate-500">Maximum 5 simulations/hour per user and 3 simulations/day per target identifier.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1">Zero Raw Storage</span>
                  <p className="text-[11px] text-slate-500">Phone numbers are instantaneously converted to irreversible HMAC-SHA256 digests.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'acceptable' && (
            <div className="space-y-2.5">
              <h4 className="font-semibold text-slate-900">Anti-Harassment & Non-Flooding Protocol</h4>
              <p>1. The user agrees NOT to attempt to connect external third-party SIP gateways or SMS aggregators without authorization.</p>
              <p>2. The user agrees NOT to use this platform to test or validate stolen or unsolicited phone number databases.</p>
              <p>3. Any automated script, crawler, or bot detected attempting to bypass Turnstile will result in an immediate permanent ban.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-2.5">
              <h4 className="font-semibold text-slate-900">Privacy-by-Design Architecture</h4>
              <p>Target telephone identifiers provided in the simulation UI are treated solely as synthetic keys. 
              The backend applies a cryptographic HMAC with a salted server secret key. Raw numbers are never written to disk or logs.</p>
              <p>Consent records are stored with anonymized hash fingerprints of IP and User-Agent headers.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-2.5">
              <h4 className="font-semibold text-slate-900">Platform Terms of Service (v1.0)</h4>
              <p>This service is offered for engineering research, Cloudflare serverless benchmarking, and Supabase RLS architectural studies. 
              Pixir and its operators disclaim all liability for user misuse.</p>
            </div>
          )}
        </div>

        {/* Checkboxes Form */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="space-y-2.5">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                I agree to the <span className="text-emerald-700 underline">Terms & Conditions</span> and the Privacy Policy.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTestingOnly}
                onChange={e => setAgreeTestingOnly(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                I agree that this system must only be used for authorized architectural simulation & testing.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeSuspension}
                onChange={e => setAgreeSuspension(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                I understand that attempting to abuse or bypass security controls will result in account suspension and audit escalation.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
              <FileText className="w-3.5 h-3.5" />
              <span>Consent will be cryptographically logged</span>
            </div>

            <button
              type="submit"
              disabled={!allAgreed}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center space-x-2 ${
                allAgreed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-soft'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept & Enter Simulator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
