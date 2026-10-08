import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN'>('USER');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleGoogleAuth = async () => {
    setLoading(true);
    // Simulates Google OAuth handshake redirect and token exchange
    setTimeout(async () => {
      await loginWithGoogle(selectedRole);
      setLoading(false);
      navigate(from, { replace: true });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-emerald-500/5 p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 mb-4">
              <Radio className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to <span className="text-emerald-600">TeleSim</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              Secure Cloudflare & Supabase Telecommunications Sandbox
            </p>
          </div>

          {/* Educational Sandbox Note */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl mb-6 flex items-start space-x-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Safety Guarantee:</strong> All actions within this sandbox are strictly synthetic. 
              No real telephone numbers will ever be contacted or charged.
            </p>
          </div>

          {/* Role Selection for Evaluation */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Sandbox Identity Role:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole('USER')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'USER'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard Learner</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Role: USER (5 jobs/hr limit)</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('ADMIN')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>SecOps Lead</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Role: ADMIN (Killswitch & Audit)</p>
              </button>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-all shadow-sm flex items-center justify-center space-x-3 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google OAuth</span>
              </>
            )}
          </button>

          {/* Terms Footer */}
          <p className="mt-6 text-[11px] text-center text-slate-500 leading-relaxed">
            By signing in, you agree to the{' '}
            <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/acceptable-use" className="text-emerald-600 hover:underline">Acceptable Use Policy</Link>. 
            First-time sign-ins require cryptographically signing the Responsible Use Agreement.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
};
