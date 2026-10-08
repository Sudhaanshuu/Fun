import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Power, 
  Activity, 
  FileText, 
  Sliders, 
  Search,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teleSimStore } from '../services/store';
import { SystemConfig, AuditLog, AbuseReport } from '../types';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, switchRole } = useAuth();
  const [config, setConfig] = useState<SystemConfig>(teleSimStore.getConfig());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(teleSimStore.getAuditLogs());
  const [reports, setReports] = useState<AbuseReport[]>(teleSimStore.getAbuseReports());
  const [auditFilter, setAuditFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'system' | 'abuse' | 'audit' | 'controls'>('system');

  const sync = () => {
    setConfig(teleSimStore.getConfig());
    setAuditLogs(teleSimStore.getAuditLogs());
    setReports(teleSimStore.getAbuseReports());
  };

  useEffect(() => {
    return teleSimStore.subscribe(sync);
  }, []);

  // 403 Forbidden check if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl max-w-md w-full space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">403 — Unauthorized Admin Access</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your active role is <strong className="text-slate-800 font-mono">{user?.role || 'ANONYMOUS'}</strong>. 
              The Security Operations & Kill-Switch Console requires verified <strong className="text-amber-700">ADMIN</strong> credentials.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => switchRole('ADMIN')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
              >
                Switch to Admin Mode (Educational Demo)
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleToggleSimulator = () => {
    if (!user) return;
    teleSimStore.updateConfig({ simulation_enabled: !config.simulation_enabled }, user.id);
  };

  const handleToggleMaintenance = () => {
    if (!user) return;
    teleSimStore.updateConfig({ maintenance_mode: !config.maintenance_mode }, user.id);
  };

  const handleUpdateLimit = (key: keyof SystemConfig, val: number) => {
    if (!user) return;
    teleSimStore.updateConfig({ [key]: val }, user.id);
  };

  const handleReportAction = (reportId: string, status: AbuseReport['status']) => {
    teleSimStore.updateReportStatus(reportId, status);
  };

  const allJobs = teleSimStore.getJobs();
  const activeJobs = allJobs.filter(j => j.status === 'PENDING' || j.status === 'PROCESSING' || j.status === 'RINGING' || j.status === 'CONNECTED');
  const turnstileFailures = auditLogs.filter(a => a.action === 'TURNSTILE_FAILED').length;
  const rateLimitBlocks = auditLogs.filter(a => a.action === 'RATE_LIMIT_TRIGGERED').length;

  const filteredLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
    l.resource_type.toLowerCase().includes(auditFilter.toLowerCase()) ||
    (l.user_email && l.user_email.toLowerCase().includes(auditFilter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold tracking-tight">SecOps Admin Command Center</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ROLE: ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Global system monitoring, circuit breaker kill-switch, abuse sentinel & audit trail
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleSimulator}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                config.simulation_enabled
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 shadow-md'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 shadow-md'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{config.simulation_enabled ? 'ENGAGE KILL-SWITCH' : 'RESTORE SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: 'system', label: 'System Overview & Telemetry', icon: Activity },
            { id: 'controls', label: 'Safety Thresholds & Circuit Breakers', icon: Sliders },
            { id: 'abuse', label: `Abuse Queue (${reports.filter(r => r.status === 'PENDING').length})`, icon: ShieldAlert },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: System Overview */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Simulator State</span>
                <span className={`text-base font-extrabold mt-1 block ${config.simulation_enabled ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {config.simulation_enabled ? 'OPERATIONAL' : 'DISABLED'}
                </span>
                <span className="text-[10px] text-slate-400">Killswitch ready</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">In-Flight Jobs</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{activeJobs.length}</span>
                <span className="text-[10px] text-slate-400">Queue active</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Jobs / Min Limit</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{config.global_rate_limit}</span>
                <span className="text-[10px] text-slate-400">Global ceiling</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Turnstile Blocked</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{turnstileFailures}</span>
                <span className="text-[10px] text-slate-400">Bot attempts trapped</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Rate Limit Hits</span>
                <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{rateLimitBlocks}</span>
                <span className="text-[10px] text-slate-400">Violations suppressed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Maintenance</span>
                <span className={`text-base font-extrabold mt-1 block ${config.maintenance_mode ? 'text-amber-600' : 'text-slate-700'}`}>
                  {config.maintenance_mode ? 'ACTIVE' : 'OFF'}
                </span>
                <span className="text-[10px] text-slate-400">Global toggle</span>
              </div>
            </div>

            {/* High-Risk Simulation Watchlist */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Abuse Scoring & Behavioral Analysis</h3>
              <p className="text-xs text-slate-500 mb-4">
                Automated heuristic risk scoring (0-30 NORMAL, 31-60 REVIEW, 61-80 RESTRICTED, 81-100 BLOCKED).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">Demo Learner (usr_edu_9921)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Score: 12 (NORMAL)
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">Verified Google OAuth account. Respects hourly rate limit. 2 simulated jobs today.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">Suspicious Fingerprint (fp_982b_bot)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      Score: 88 (BLOCKED)
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">Repeated Turnstile challenge bypass attempts detected. Trapped at Cloudflare WAF boundary.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Safety Thresholds */}
        {activeTab === 'controls' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Safety Limits & Circuit Breakers</h3>
              <p className="text-xs text-slate-500">Fine-tune serverless defense thresholds in real time</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Global Rate Limit (Jobs / Minute)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={config.global_rate_limit}
                  onChange={e => handleUpdateLimit('global_rate_limit', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum global traffic allowed</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Max Jobs / User / Hour
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={config.max_simulations_per_user_hour}
                  onChange={e => handleUpdateLimit('max_simulations_per_user_hour', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Prevents single-account spam</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Max Events / Target / Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.max_events_per_target_day}
                  onChange={e => handleUpdateLimit('max_events_per_target_day', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Protects individual target hash</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Maintenance Mode</h4>
                <p className="text-[11px] text-slate-500">Temporarily suspends job ingestion while preserving running workers</p>
              </div>
              <button
                type="button"
                onClick={handleToggleMaintenance}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.maintenance_mode
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {config.maintenance_mode ? 'Deactivate Maintenance' : 'Activate Maintenance'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Abuse Reports Queue */}
        {activeTab === 'abuse' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Abuse Reports Triage</h3>
                <p className="text-xs text-slate-500">Reports submitted through /report-abuse</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Report ID</th>
                    <th className="px-6 py-4">Reporter</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Simulation ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No abuse reports submitted. System operating in clean compliance.
                      </td>
                    </tr>
                  ) : (
                    reports.map(rep => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{rep.id}</td>
                        <td className="px-6 py-4">{rep.reporter_email}</td>
                        <td className="px-6 py-4 font-semibold text-rose-700">{rep.reason}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{rep.simulation_id || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rep.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {rep.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleReportAction(rep.id, 'RESOLVED')}
                                className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                Resolve & Suppress
                              </button>
                              <button
                                onClick={() => handleReportAction(rep.id, 'DISMISSED')}
                                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cryptographic Audit Logs</h3>
                <p className="text-xs text-slate-500">Immutable ledger of authentication, consent, and simulation events</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditFilter}
                  onChange={e => setAuditFilter(e.target.value)}
                  placeholder="Filter by action or email..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 font-sans">
                  <tr>
                    <th className="px-6 py-4">Event ID</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Actor</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3 text-slate-400">{log.id}</td>
                      <td className="px-6 py-3 font-bold text-emerald-700 font-sans">{log.action}</td>
                      <td className="px-6 py-3 text-slate-600">{log.resource_type}: {log.resource_id}</td>
                      <td className="px-6 py-3 text-slate-500 font-sans">{log.user_email || log.user_id}</td>
                      <td className="px-6 py-3 text-slate-400 text-[11px] font-sans">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
