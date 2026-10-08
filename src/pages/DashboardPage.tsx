import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  ArrowUpRight, 
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teleSimStore } from '../services/store';
import { SimulationJob } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConsentModal } from '../components/common/ConsentModal';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const DashboardPage: React.FC = () => {
  const { user, hasConsent } = useAuth();
  const [showConsentModal, setShowConsentModal] = useState(!hasConsent);
  const [jobs, setJobs] = useState<SimulationJob[]>([]);
  const [config, setConfig] = useState(teleSimStore.getConfig());

  const sync = () => {
    if (user) {
      setJobs(teleSimStore.getJobs(user.id));
      setConfig(teleSimStore.getConfig());
    }
  };

  useEffect(() => {
    sync();
    return teleSimStore.subscribe(sync);
  }, [user]);

  useEffect(() => {
    setShowConsentModal(!hasConsent);
  }, [hasConsent]);

  const activeJob = jobs.find(
    j => j.status === 'PENDING' || j.status === 'PROCESSING' || j.status === 'RINGING' || j.status === 'CONNECTED'
  );
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length;
  const failedJobs = jobs.filter(j => j.status === 'FAILED').length;
  const jobsLastHour = user ? teleSimStore.getUserJobsLastHour(user.id) : 0;
  const remainingRateLimit = Math.max(0, config.max_simulations_per_user_hour - jobsLastHour);
  const abuseScore = user ? teleSimStore.calculateAbuseScore(user.id) : { score: 0, level: 'NORMAL' };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      {/* Mandatory Consent Modal if not yet accepted */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsentAccepted={() => setShowConsentModal(false)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Welcome Header & Main CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome, {user?.display_name || 'Engineer'}
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {user?.role || 'USER'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Consent Status: <span className="text-emerald-600 font-semibold">Active (v1.0 Signed)</span> • Isolated Simulation Sandbox Active
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/simulate"
              className="px-6 py-3 rounded-full font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 group"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>New Simulation</span>
            </Link>
          </div>
        </div>

        {/* 6 Metric Cards (Requirement Section 7) */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          
          {/* Card 1: Simulation Credits */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Credits</span>
              <Terminal className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">50</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Educational quota</p>
          </div>

          {/* Card 2: Simulations Today */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{jobs.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Simulations created</p>
          </div>

          {/* Card 3: Successful */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Success</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{completedJobs}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Completed jobs</p>
          </div>

          {/* Card 4: Failed */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Failed</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{failedJobs}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero failures</p>
          </div>

          {/* Card 5: Remaining Rate Limit */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Rate Limit</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{remainingRateLimit} / 5</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Left this hour</p>
          </div>

          {/* Card 6: Account Status */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-extrabold text-emerald-600">{user?.status || 'ACTIVE'}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Risk: {abuseScore.level}</p>
          </div>

        </div>

        {/* Live Running Simulation Banner (if active) */}
        {activeJob && (
          <div className="mb-8 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Simulation Job In-Flight ({activeJob.id})
                </span>
              </div>
              <h3 className="text-xl font-bold">
                {activeJob.simulation_type === 'voice' ? 'Simulated Voice Call Session' : activeJob.simulation_type === 'sms' ? 'Simulated SMS Packet Dispatch' : 'Simulated Voice + SMS Dispatch'}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Target: {activeJob.target_masked} • Current State: <strong className="text-white">{activeJob.status}</strong> • No real carrier dialed.
              </p>
            </div>

            <Link
              to={`/simulations/${activeJob.id}`}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm shrink-0 flex items-center space-x-2"
            >
              <span>Watch Live Progress</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Recent Simulation History Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Simulation Jobs</h3>
              <p className="text-xs text-slate-500">Live telemetry and carrier simulation audit log</p>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to="/simulations"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <span>View All History</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Job ID</th>
                  <th className="px-6 py-3.5">Target (Masked)</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Events</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No simulations recorded yet. Click "New Simulation" to launch your first educational test!
                    </td>
                  </tr>
                ) : (
                  jobs.slice(0, 5).map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                        {job.target_masked}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium flex items-center space-x-1 text-slate-600">
                          {job.simulation_type === 'voice' ? (
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          )}
                          <span>{job.simulation_type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {job.completed_count} / {job.requested_count}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/simulations/${job.id}`}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          View Logs
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
