import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  ShieldCheck, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teleSimStore } from '../services/store';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { KillSwitchBanner } from '../components/common/KillSwitchBanner';

export const AccountPage: React.FC = () => {
  const { user, consentRecord, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full">
            <h2 className="text-lg font-bold text-slate-800">Authentication Required</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Please sign in with Google to view account settings.
            </p>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-emerald-600 text-white"
            >
              Go to Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleExportData = () => {
    const dataJson = teleSimStore.exportUserData(user.id);
    const blob = new Blob([dataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telesim-user-export-${user.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  const handleDeleteAccount = () => {
    teleSimStore.deleteUserAccount(user.id);
    logout();
    navigate('/');
  };

  const userJobs = teleSimStore.getJobs(user.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <KillSwitchBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">User Account & Privacy Controls</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your developer profile, download GDPR audit logs, and review cryptographic consent records
          </p>
        </div>

        {exportNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>GDPR JSON export downloaded successfully. All audit records and job events included.</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={user.display_name}
                className="w-16 h-16 rounded-2xl border-2 border-emerald-400 object-cover"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.display_name}</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {user.role}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {user.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">Account Created</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">Total Simulations Executed</span>
              <span className="font-semibold text-emerald-600 mt-1 block">
                {userJobs.length} synthetic jobs
              </span>
            </div>
          </div>
        </div>

        {/* Consent & Privacy Status Card (Requirement 18 & 6) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Responsible Use Consent Record</h3>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="font-medium text-emerald-900">Agreement Status</span>
              <span className="font-bold text-emerald-700">Active (Signed)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Terms Version</span>
                <span className="font-bold text-slate-800">{consentRecord?.terms_version || '1.0'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Privacy Version</span>
                <span className="font-bold text-slate-800">{consentRecord?.privacy_version || '1.0'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                <span className="text-[10px] text-slate-400 block">Accepted At</span>
                <span className="font-mono text-slate-700">
                  {consentRecord?.accepted_at ? new Date(consentRecord.accepted_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Actions & Privacy Controls */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Data Sovereignty & Actions</h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Export All Personal Data</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Download a machine-readable JSON archive of your user profile, consent logs, and simulation records.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 flex items-center space-x-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100 gap-3">
              <div>
                <h4 className="text-xs font-bold text-rose-900">Delete Account & Revoke Data</h4>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Permanently purge your account, consent records, and historical simulation logs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 flex items-center space-x-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete your account? All consent logs and simulated telecommunication records will be irrevocably deleted.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
