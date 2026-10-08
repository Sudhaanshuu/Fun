import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { teleSimStore } from '../services/store';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const ReportAbusePage: React.FC = () => {
  const [simulationId, setSimulationId] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reason, setReason] = useState<'Unauthorized use' | 'Harassment' | 'Suspicious activity' | 'Privacy concern' | 'Other'>('Unauthorized use');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterEmail || !description) return;

    teleSimStore.submitAbuseReport({
      simulation_id: simulationId || undefined,
      reporter_email: reporterEmail,
      reason,
      description,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Report Abuse or Misuse</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Our Security Operations Sentinel investigates all reported activity. We maintain a zero-tolerance policy against telecom harassment.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Report Received & Queued for Review</h2>
              <p className="text-xs text-emerald-950 max-w-md mx-auto leading-relaxed">
                Thank you for notifying SecOps. Our automated intake has recorded your incident details. 
                Any corresponding simulation keys have been restricted pending manual investigation.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Simulation Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={simulationId}
                  onChange={e => setSimulationId(e.target.value)}
                  placeholder="sim_172839..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  placeholder="reporter@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Abuse Category *
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Unauthorized use">Unauthorized use</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Suspicious activity">Suspicious activity</option>
                  <option value="Privacy concern">Privacy concern</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Incident Description & Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the nature of the unauthorized simulation or observed behavior..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Formal Incident Report</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
