import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Search, PhoneCall, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teleSimStore } from '../services/store';
import { SimulationJob } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const SimulationsHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<SimulationJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const sync = () => {
    if (user) {
      setJobs(teleSimStore.getJobs(user.id));
    }
  };

  useEffect(() => {
    sync();
    return teleSimStore.subscribe(sync);
  }, [user]);

  const filtered = jobs.filter(job => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.target_masked.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'ALL') return matchesSearch;
    if (filterType === 'VOICE') return matchesSearch && job.simulation_type === 'voice';
    if (filterType === 'SMS') return matchesSearch && job.simulation_type === 'sms';
    if (filterType === 'COMPLETED') return matchesSearch && job.status === 'COMPLETED';
    if (filterType === 'ACTIVE') return matchesSearch && (job.status === 'PENDING' || job.status === 'PROCESSING' || job.status === 'RINGING' || job.status === 'CONNECTED');
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Simulation Job History</h1>
            <p className="text-xs text-slate-500 mt-1">
              Historical ledger of synthetic telecommunication events and carrier state logs
            </p>
          </div>

          <Link
            to="/simulate"
            className="px-5 py-2.5 rounded-full font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>New Simulation</span>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Job ID or masked number..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'ACTIVE', 'VOICE', 'SMS', 'COMPLETED'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterType === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Job Identifier</th>
                  <th className="px-6 py-4">Target (Masked)</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Count</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No simulation records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                        {job.target_masked}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium flex items-center space-x-1.5 text-slate-600">
                          {job.simulation_type === 'voice' ? (
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          )}
                          <span>{job.simulation_type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        {job.completed_count} / {job.requested_count}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/simulations/${job.id}`}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
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
