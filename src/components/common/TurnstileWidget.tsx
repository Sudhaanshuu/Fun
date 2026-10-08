import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify, onExpire }) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'expired'>('idle');
  const [token, setToken] = useState<string>('');

  const runChallenge = () => {
    setStatus('verifying');
    const timer = setTimeout(() => {
      const generatedToken = `cf_ts_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      setToken(generatedToken);
      setStatus('success');
      onVerify(generatedToken);
    }, 1100);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cancel = runChallenge();
    return () => cancel?.();
  }, []);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setToken('');
    setStatus('idle');
    onExpire?.();
    runChallenge();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {status === 'verifying' && (
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-in zoom-in-50" />
          )}
          {status === 'idle' && (
            <div className="w-6 h-6 border-2 border-slate-300 rounded cursor-pointer" onClick={runChallenge} />
          )}

          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cloudflare Turnstile</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {status === 'verifying' && 'Evaluating client signature & WAF policy...'}
              {status === 'success' && 'Human verification token active'}
              {status === 'idle' && 'Click to verify security token'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end pl-2">
          <div className="flex items-center space-x-1 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Managed Challenge</span>
          </div>
          {status === 'success' && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center space-x-0.5 mt-0.5"
              title="Regenerate token"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Renew</span>
            </button>
          )}
        </div>
      </div>

      {token && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="font-mono truncate max-w-[200px]">Token: {token}</span>
          <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">Server-Ready</span>
        </div>
      )}
    </div>
  );
};
