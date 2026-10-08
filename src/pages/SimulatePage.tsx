import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, 
  PhoneCall, 
  MessageSquare, 
  Layers, 
  ShieldAlert, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teleSimStore } from '../services/store';
import { SimulationType } from '../types';
import { isValidE164, maskPhoneNumber } from '../lib/crypto';
import { TurnstileWidget } from '../components/common/TurnstileWidget';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';
import { ConsentModal } from '../components/common/ConsentModal';

export const SimulatePage: React.FC = () => {
  const { user, isAuthenticated, hasConsent } = useAuth();
  const navigate = useNavigate();

  const [targetNumber, setTargetNumber] = useState('+919876543210');
  const [simulationType, setSimulationType] = useState<SimulationType>('voice');
  const [simulationCount, setSimulationCount] = useState<number>(2);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(!hasConsent);

  const isValidNumber = isValidE164(targetNumber);
  const maskedPreview = maskPhoneNumber(targetNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isAuthenticated || !user) {
      setErrorMsg('Authentication required. Please sign in with Google first.');
      return;
    }

    if (!hasConsent) {
      setShowConsentModal(true);
      return;
    }

    if (!isValidNumber) {
      setErrorMsg('Please enter a valid international phone format (e.g. +919876543210 or +12025550143).');
      return;
    }

    if (!turnstileToken) {
      setErrorMsg('Please complete Cloudflare Turnstile verification challenge.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await teleSimStore.createSimulationJob({
        userId: user.id,
        targetRaw: targetNumber,
        simulationType,
        requestedCount: simulationCount,
        turnstileToken,
      });

      if (result.error) {
        setErrorMsg(result.error.message);
        setSubmitting(false);
      } else if (result.job) {
        navigate(`/simulations/${result.job.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch simulation request.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <ConsentModal
        isOpen={showConsentModal}
        onConsentAccepted={() => setShowConsentModal(false)}
      />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 mb-3">
            <Radio className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dispatch Synthetic <span className="text-emerald-600">Simulation Job</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Test serverless queuing and event dispatching. 100% synthetic telecommunication sandbox.
          </p>
        </div>

        {/* Mandatory Prominent Notice Card (Requirement 8) */}
        <div className="mb-6 bg-emerald-50 border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-emerald-950 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="block text-emerald-900 font-bold mb-0.5 uppercase tracking-wide">
              Notice: This is a simulated telecommunications request.
            </strong>
            <span>
              <strong>No real call or SMS will be sent.</strong> Target telephone numbers act solely as synthetic cryptographic identifiers. 
              Flooding, carrier dialing, or harassment is completely prevented by architectural design.
            </span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Field 1: Target Number */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Target Phone Identifier (E.164 Format) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={targetNumber}
                onChange={e => setTargetNumber(e.target.value)}
                placeholder="+919876543210"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  isValidNumber ? 'border-slate-300' : 'border-rose-300 focus:border-rose-500'
                }`}
              />
              {isValidNumber && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Valid Format
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Masked Preview: <strong className="font-mono text-slate-700">{maskedPreview}</strong>
              </span>
              <span className="text-slate-400">Zero raw storage policy</span>
            </div>
          </div>

          {/* Field 2: Simulation Type */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Simulation Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'voice', label: 'Voice Call', desc: 'SIP INVITE & Ringing session', icon: PhoneCall },
                { id: 'sms', label: 'SMS Message', desc: 'SMPP queue & DLR receipt', icon: MessageSquare },
                { id: 'voice_sms', label: 'Voice + SMS', desc: 'Combined multi-protocol test', icon: Layers },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = simulationType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSimulationType(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-900">{item.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 3: Simulation Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800">
                Simulation Event Count (Capped for Anti-Abuse) *
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                MAX: 5
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 5].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setSimulationCount(cnt)}
                  className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                    simulationCount === cnt
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'event' : 'events'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Strict educational limit. Prevents any high-volume burst testing.
            </p>
          </div>

          {/* Field 4: Turnstile Verification Widget (Requirement 9) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Cloudflare Turnstile Verification *
            </label>
            <TurnstileWidget
              onVerify={tok => setTurnstileToken(tok)}
              onExpire={() => setTurnstileToken('')}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting || !turnstileToken || !isValidNumber}
              className={`w-full py-4 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                submitting || !turnstileToken || !isValidNumber
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 hover:shadow-emerald-600/35 transform hover:-translate-y-0.5'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating Worker Security Policies...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Simulated Telecommunications Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
};
