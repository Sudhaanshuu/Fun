import React from 'react';

export const StatsCounter: React.FC = () => {
  const stats = [
    { label: 'Simulated Jobs Dispatched', value: '250,000+', subtext: 'Synthetic calls & SMS' },
    { label: 'Real Carrier Floods Prevented', value: '100%', subtext: 'Zero carrier abuse' },
    { label: 'Cloudflare Worker Latency', value: '< 15ms', subtext: 'Global edge response' },
    { label: 'Active PoP Sandbox Nodes', value: '12 PoPs', subtext: 'Mumbai, US, EU & APAC' },
  ];

  return (
    <section className="mt-12 sm:mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {stats.map((s, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 md:pt-0' : ''}>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-bold text-slate-800">
                {s.label}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                {s.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
