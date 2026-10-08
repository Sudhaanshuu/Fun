import React from 'react';
import { SimulationStatus } from '../../types';
import { Clock, PhoneCall, CheckCircle, AlertCircle, PhoneIncoming, MessageSquare, XCircle } from 'lucide-react';

export const StatusBadge: React.FC<{ status: SimulationStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>Queued</span>
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-0.5" />
          <span>Processing</span>
        </span>
      );
    case 'RINGING':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
          <PhoneIncoming className="w-3 h-3 text-emerald-600 animate-bounce" />
          <span>Ringing (Simulated)</span>
        </span>
      );
    case 'CONNECTED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-400">
          <PhoneCall className="w-3 h-3 text-emerald-700" />
          <span>Connected</span>
        </span>
      );
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
          <MessageSquare className="w-3 h-3 text-emerald-600" />
          <span>Delivered (Simulated)</span>
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Completed</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <XCircle className="w-3 h-3 text-slate-500" />
          <span>Cancelled</span>
        </span>
      );
    case 'FAILED':
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>Failed</span>
        </span>
      );
  }
};
