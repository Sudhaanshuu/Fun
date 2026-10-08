import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleSlide {
  id: number;
  date: string;
  category: string;
  title: string;
  summary: string;
  iconBg: string;
  icon: any;
  link: string;
}

const ARTICLES: ArticleSlide[] = [
  {
    id: 1,
    date: 'Oct 8, 2026',
    category: 'Architecture Deep-Dive',
    title: 'Why Serverless Call Simulation Never Floods Carriers',
    summary: 'Traditional flooding utilities bypass protections and hammer real SS7/SIP trunks. Learn how our decoupled SimulationProvider generates authentic synthetic states (INVITE, Ringing, 200 OK) completely in memory without dialing physical phone numbers.',
    iconBg: 'from-emerald-500 to-teal-600',
    icon: Cpu,
    link: '/acceptable-use',
  },
  {
    id: 2,
    date: 'Sep 29, 2026',
    category: 'Security & WAF',
    title: 'Cloudflare Turnstile vs Traditional Captcha in High-Throughput APIs',
    summary: 'Evaluating managed challenges against automated scripts. How server-side cryptographic token verification prevents credential stuffing, rate-limit bypassing, and unauthorized high-frequency automated simulation abuse.',
    iconBg: 'from-teal-600 to-emerald-700',
    icon: ShieldCheck,
    link: '/privacy',
  },
  {
    id: 3,
    date: 'Sep 15, 2026',
    category: 'Privacy by Design',
    title: 'HMAC Target Hashing: Protecting Recipient Privacy by Design',
    summary: 'Why modern telecommunications platforms should never store plain text phone numbers. Analyzing salted HMAC-SHA256 digests for cross-session rate limits while ensuring complete user zero-knowledge privacy.',
    iconBg: 'from-emerald-600 to-green-700',
    icon: BookOpen,
    link: '/privacy',
  },
];

export const NewsScroller: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? ARTICLES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === ARTICLES.length - 1 ? 0 : prev + 1));
  };

  const active = ARTICLES[currentSlide];
  const Icon = active.icon;

  return (
    <section id="insights" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Educational <span className="text-emerald-600">Insights</span> & Bulletins
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Stay informed about serverless telecommunications architecture, anti-bot defenses, and ethical engineering.
          </p>
        </div>

        {/* Carousel Container matching screenshot */}
        <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 max-w-4xl mx-auto overflow-hidden">
          
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous insight"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-md flex items-center justify-center transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next insight"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-md flex items-center justify-center transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center px-4 sm:px-8">
            
            {/* Visual Icon Box */}
            <div className="md:col-span-5 flex justify-center">
              <div className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr ${active.iconBg} p-6 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-500/20 transform hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-20 h-20 text-white/95" />
                <span className="mt-3 text-xs font-semibold tracking-wider uppercase text-emerald-100">
                  {active.category}
                </span>
              </div>
            </div>

            {/* Text Description Box */}
            <div className="md:col-span-7 space-y-3 text-left">
              <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <span>{active.date}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{active.category}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {active.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {active.summary}
              </p>

              <div className="pt-3">
                <Link
                  to={active.link}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>Read Architecture Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {ARTICLES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
