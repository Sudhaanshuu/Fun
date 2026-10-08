import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { teleSimStore } from '../../services/store';

export const ContactAbuseSection: React.FC = () => {
  const [reporterEmail, setReporterEmail] = useState('');
  const [simulationId, setSimulationId] = useState('');
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
    setDescription('');
    setSimulationId('');
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Get in <span className="text-emerald-600">Touch</span> With Us
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Have questions regarding serverless telecommunications research or need to report suspicious activity?
          </p>
        </div>

        {/* 2-Column Layout matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Telecom Lab & Compliance
              </h3>

              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lab Headquarters</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Pixir Telecom Research Center<br />
                      Infocity, Patia, Bhubaneswar, Odisha 751024
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Compliance Desk</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-mono">
                      +91 8052205701
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Responsible Disclosure</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-mono">
                      abuse-disclosure@pixir.in
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Automated Sentry Hours</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      24/7 Global Rate Limit & Anti-Abuse Sentinel Active
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <span className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Zero Tolerance Policy for Unsolicited Robocalls or SMS Spam</span>
              </span>
            </div>
          </div>

          {/* Right Column: Send Us a Message / Abuse Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Send Us a Message / Report Abuse
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our automated intake routes verified abuse reports directly to the Security Operations Queue.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Inquiry / Abuse Report Received</h4>
                <p className="text-xs text-emerald-900 max-w-md mx-auto">
                  Thank you for keeping telecommunication networks secure. Our SecOps team has logged the report. 
                  Any associated target hashes have been flagged for automated rate suppression.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={reporterEmail}
                      onChange={e => setReporterEmail(e.target.value)}
                      placeholder="security-officer@org.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Simulation ID (if applicable)
                    </label>
                    <input
                      type="text"
                      value={simulationId}
                      onChange={e => setSimulationId(e.target.value)}
                      placeholder="sim_172839..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Classification Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Unauthorized use">Unauthorized use</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Suspicious activity">Suspicious activity</option>
                    <option value="Privacy concern">Privacy concern</option>
                    <option value="Other">Other / General inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Incident Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide details regarding the simulated event or technical inquiry..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Send Message & Log Report</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
