import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  StopCircle 
} from 'lucide-react';
import { teleSimStore } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { SimulationJob, SimulationStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const SimulationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [job, setJob] = useState<SimulationJob | undefined>(
    id ? teleSimStore.getJobById(id) : undefined
  );

  useEffect(() => {
    const sync = () => {
      if (id) {
        setJob(teleSimStore.getJobById(id));
      }
    };
    return teleSimStore.subscribe(sync);
  }, [id]);

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800">Simulation Job Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              The requested simulation job ID does not exist or has expired from cache.
            </p>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isRunning = job.status === 'PENDING' || job.status === 'PROCESSING' || job.status === 'RINGING' || job.status === 'CONNECTED';

  // Voice progress steps
  const voiceSteps: { key: SimulationStatus; label: string }[] = [
    { key: 'PENDING', label: 'Created & Queued' },
    { key: 'PROCESSING', label: 'Worker Bound' },
    { key: 'RINGING', label: 'Ringing (180)' },
    { key: 'CONNECTED', label: 'Connected (200 OK)' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  // SMS progress steps
  const smsSteps: { key: SimulationStatus; label: string }[] = [
    { key: 'PENDING', label: 'Created' },
    { key: 'PROCESSING', label: 'Queued (SMPP)' },
    { key: 'DELIVERED', label: 'Delivered (DLR)' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const steps = job.simulation_type === 'sms' ? smsSteps : voiceSteps;

  const getStepIndex = (status: SimulationStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'RINGING': return 2;
      case 'CONNECTED': return 3;
      case 'DELIVERED': return 2;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(job.status);

  const handleCancel = () => {
    if (user && job) {
      teleSimStore.cancelSimulation(job.id, user.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Navigation & Status Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/simulations"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulation History</span>
          </Link>

          {isRunning && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Cancel Job</span>
            </button>
          )}
        </div>

        {/* Fictional Telecom Visual Banner (Requirement 24) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 mb-6 overflow-hidden relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-slate-900">{job.id}</span>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Dispatched at {new Date(job.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Masked Target Identifier</span>
              <span className="font-mono font-extrabold text-lg text-emerald-700">{job.target_masked}</span>
            </div>
          </div>

          {/* Prominent Safety Notice matching Requirement 24 */}
          <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-900 block">
              {job.simulation_type === 'sms' 
                ? 'SIMULATED SMS — NOT SENT' 
                : 'SIMULATION — NO REAL CALL'}
            </span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Synthetic telecommunication protocol session active • Zero outbound SS7/SIP audio dialing
            </p>
          </div>

          {/* Visual Step-by-Step Progress Pipeline */}
          <div className="mt-8 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
              Telecommunication Pipeline Progression
            </h4>

            <div className="relative">
              <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-slate-100">
                <div
                  style={{ width: `${Math.min(100, ((currentStepIdx + 1) / steps.length) * 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {steps.map((st, sIdx) => {
                  const isDone = sIdx <= currentStepIdx;
                  const isCurrent = sIdx === currentStepIdx && isRunning;
                  return (
                    <div key={st.key} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                      </div>
                      <span className={`text-[11px] font-semibold mt-1.5 ${
                        isDone ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Live Step-by-Step Telemetry Logs */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight">Real-Time Simulation Worker Logs</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Live Stream
            </span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {job.logs.map((log, lIdx) => (
              <div key={lIdx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 text-[10px]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {log.state}:
                  </span>
                  <span className="text-slate-200">
                    {log.message}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 shrink-0">
                  Latency: <span className="text-emerald-300 font-bold">{log.carrier_latency_ms}ms</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              Serverless HMAC Hash: <span className="font-mono text-slate-300">{job.target_hash}</span>
            </div>
            <div className="text-emerald-400">
              Zero Carrier Charges • Educational Sandbox
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
