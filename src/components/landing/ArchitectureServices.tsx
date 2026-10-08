import React from 'react';
import { Layers, ShieldCheck, Database, Zap, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export const ArchitectureServices: React.FC = () => {
  const pillars = [
    {
      title: 'Asynchronous Job Queues',
      desc: 'Decoupled Cloudflare Workers and queues handle high-concurrency simulation requests with zero server bottleneck.',
      icon: Layers,
      tag: 'Cloudflare Workers',
      bullets: ['Worker edge dispatch', 'Stateful job polling', 'Sub-millisecond routing'],
    },
    {
      title: 'Responsible Consent & Anti-Abuse',
      desc: 'Mandatory cryptographic consent registration with versioning, user rate limiting, and dynamic risk scoring.',
      icon: ShieldCheck,
      tag: 'Abuse Mitigation',
      bullets: ['Consent version tracking', 'Per-user 5 jobs/hr limit', 'Concurrent execution caps'],
    },
    {
      title: 'Zero-Knowledge Target Hashing',
      desc: 'Strict privacy-by-design: Recipient numbers are instantly hashed with a salted server secret key.',
      icon: Lock,
      tag: 'HMAC-SHA256',
      bullets: ['Zero raw numbers stored', 'Masked UI presentation', 'Irreversible audit keys'],
    },
    {
      title: 'Emergency Kill-Switch & RLS',
      desc: 'SecOps lead emergency killswitch disables simulation globally with Supabase Row Level Security tenant isolation.',
      icon: Database,
      tag: 'Supabase Postgres',
      bullets: ['auth.uid() = user_id RLS', 'Instant global circuit trip', '503 maintenance mode'],
    },
  ];

  return (
    <section id="architecture" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Architectural <span className="text-emerald-600">Pillars</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Enterprise-grade serverless components engineered to deliver high-fidelity telecommunications simulation 
            while guaranteeing absolute carrier protection and privacy.
          </p>
        </div>

        {/* 4 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-300 shadow-card hover:shadow-emerald-soft transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {pillar.tag}
                  </span>

                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  {pillar.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
