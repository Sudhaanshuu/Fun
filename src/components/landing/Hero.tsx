import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ShieldCheck, ArrowRight, Server } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Soft background radial emerald flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-200/25 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-800">
            Educational Architecture • Zero Telecom Harassment Guarantee
          </span>
        </div>

        {/* Big Headline matching the screenshot structure */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
          Consent-Based Call & SMS Simulation Reimagined for{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Secure Serverless Learning
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Learn Cloudflare Workers, Turnstile anti-bot verification, Supabase Row Level Security, 
          and HMAC privacy hashing through a production-grade synthetic telecommunications pipeline.
        </p>

        {/* Action Buttons matching screenshot */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/simulate"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <span>Try the Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#architecture"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Explore Architecture</span>
          </a>
        </div>

        {/* Responsible use badge */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strictly isolated synthetic sandbox • Never dials or floods real carriers</span>
        </div>

      </div>
    </section>
  );
};
