import React from 'react';
import { PhoneCall, MessageSquare, Shield, KeyRound, ArrowUpRight } from 'lucide-react';

export const QuickCards: React.FC = () => {
  const cards = [
    {
      title: 'Voice Call Engine',
      desc: 'Synthetic SIP INVITE, Ringing & Connected state transitions',
      icon: PhoneCall,
      color: 'from-emerald-500 to-teal-500',
      link: '/simulate',
    },
    {
      title: 'SMS Pipeline',
      desc: 'Simulated SMPP queues, delivery receipts & rate meters',
      icon: MessageSquare,
      color: 'from-teal-500 to-emerald-600',
      link: '/simulate',
    },
    {
      title: 'Turnstile & WAF',
      desc: 'Bot mitigation & server-side token proof verification',
      icon: Shield,
      color: 'from-emerald-600 to-green-600',
      link: '#security',
    },
    {
      title: 'HMAC Privacy Shield',
      desc: 'Zero-knowledge salted hashing — no raw numbers stored',
      icon: KeyRound,
      color: 'from-green-600 to-emerald-500',
      link: '/privacy',
    },
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-md shadow-emerald-500/20 mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                {c.title}
              </h3>

              <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {c.desc}
              </p>

              <div className="mt-3 flex items-center text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                <span>Explore</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
