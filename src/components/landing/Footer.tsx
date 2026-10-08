import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Heart, ShieldCheck, Globe, Code, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-100">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Tele<span className="text-emerald-600">Sim</span> <span className="text-xs text-slate-600 font-normal">by Pixir</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed pr-4">
              Pioneering secure serverless educational simulation for next-generation telecommunication engineers. 
              Our isolated simulation engine protects carriers from spam and flooding while teaching production-grade cloud architectures.
            </p>

            <div className="flex items-center space-x-3 text-slate-400 pt-1">
              <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors">
                <Code className="w-4 h-4" />
              </a>
              <a href="https://pixir.in" target="_blank" rel="noreferrer" title="Website" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" title="Share" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
              <li><a href="#architecture" className="hover:text-emerald-600 transition-colors">Architecture</a></li>
              <li><Link to="/simulate" className="hover:text-emerald-600 transition-colors">Simulator Sandbox</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Telemetry Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-600 transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Architecture Pillars */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Serverless Tech
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="hover:text-emerald-600">Cloudflare Workers & Queues</span></li>
              <li><span className="hover:text-emerald-600">Cloudflare Turnstile WAF</span></li>
              <li><span className="hover:text-emerald-600">Supabase Row Level Security</span></li>
              <li><span className="hover:text-emerald-600">HMAC-SHA256 Target Hashing</span></li>
              <li><span className="hover:text-emerald-600">Emergency Circuit Breaker</span></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compliance & Lab
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Patia, Infocity, Bhubaneswar, Odisha 751024</li>
              <li className="font-mono text-slate-700">+91 8052205701</li>
              <li className="font-mono text-emerald-700">abuse-disclosure@pixir.in</li>
              <li className="pt-1">
                <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Subdomain Isolated: app.pixir.in</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar matching screenshot */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 space-y-4 sm:space-y-0">
          <p>© 2026 TeleSim Lab. All rights reserved. Built for educational telecommunications research.</p>

          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-700 transition-colors">Terms of Service</Link>
            <Link to="/acceptable-use" className="hover:text-emerald-700 transition-colors">Acceptable Use</Link>
            <Link to="/report-abuse" className="text-rose-600 hover:text-rose-700 font-medium">Report Abuse</Link>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-600 flex items-center justify-center space-x-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          <span>for Responsible Serverless Education</span>
        </div>

      </div>
    </footer>
  );
};
