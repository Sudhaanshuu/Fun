import React, { useState } from 'react';
import { Globe, MapPin, Radio, Wifi, Server, Activity, ShieldCheck } from 'lucide-react';

interface EdgeNode {
  id: string;
  name: string;
  city: string;
  region: string;
  latency: string;
  status: 'ONLINE' | 'STANDBY';
  activeJobs: number;
  x: number; // SVG percentage
  y: number;
}

const NODES: EdgeNode[] = [
  { id: 'bom', name: 'Cloudflare BOM', city: 'Mumbai', region: 'India (APAC)', latency: '11ms', status: 'ONLINE', activeJobs: 34, x: 67, y: 52 },
  { id: 'fra', name: 'Cloudflare FRA', city: 'Frankfurt', region: 'Europe (EU)', latency: '19ms', status: 'ONLINE', activeJobs: 28, x: 49, y: 34 },
  { id: 'iad', name: 'Cloudflare IAD', city: 'Ashburn', region: 'North America (US-East)', latency: '14ms', status: 'ONLINE', activeJobs: 42, x: 26, y: 38 },
  { id: 'sjc', name: 'Cloudflare SJC', city: 'San Jose', region: 'North America (US-West)', latency: '17ms', status: 'ONLINE', activeJobs: 19, x: 19, y: 40 },
  { id: 'sin', name: 'Cloudflare SIN', city: 'Singapore', region: 'Asia-Pacific (APAC)', latency: '16ms', status: 'ONLINE', activeJobs: 25, x: 74, y: 59 },
  { id: 'nrt', name: 'Cloudflare NRT', city: 'Tokyo', region: 'Asia-Pacific (APAC)', latency: '22ms', status: 'ONLINE', activeJobs: 18, x: 84, y: 42 },
];

export const EdgeMapSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeNode, setActiveNode] = useState<EdgeNode>(NODES[0]);

  const filterOptions = ['All', 'Mumbai', 'Frankfurt', 'Ashburn', 'San Jose', 'Singapore', 'Tokyo'];

  const filteredNodes = selectedCity === 'All' 
    ? NODES 
    : NODES.filter(n => n.city === selectedCity);

  return (
    <section id="edge-network" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover Global <span className="text-emerald-600">Edge Simulation Nodes</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Real-time serverless Cloudflare Workers dispatching synthetic telecommunications jobs with sub-20ms edge latency.
          </p>

          {/* Filter Pills matching screenshot */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {filterOptions.map(city => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  if (city !== 'All') {
                    const match = NODES.find(n => n.city === city);
                    if (match) setActiveNode(match);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCity === city
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city === 'All' ? 'All Edge PoPs' : city}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Map & Info Layout matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Summary Box */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Edge PoP Telemetry</h3>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-xs text-slate-600 font-medium">Selected PoP Endpoint</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{activeNode.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{activeNode.region}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium block">Worker Latency</span>
                    <span className="text-base font-extrabold text-emerald-600 mt-0.5 block flex items-center space-x-1">
                      <Wifi className="w-3.5 h-3.5" />
                      <span>{activeNode.latency}</span>
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium block">Active Jobs</span>
                    <span className="text-base font-extrabold text-slate-800 mt-0.5 block flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>{activeNode.activeJobs} queue</span>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1.5 text-xs text-emerald-950">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>WAF & Turnstile Status</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Managed challenge active. All simulation requests passing through this node are cryptographically verified.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Node Status: {activeNode.status}</span>
              </span>
              <span className="font-mono text-[10px]">CF-Worker-v2.6</span>
            </div>
          </div>

          {/* Right Map Canvas Visualization */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-md flex items-center justify-center min-h-[340px]">
            {/* World background map grid lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Stylized Vector World Map */}
            <svg viewBox="0 0 1000 500" className="w-full h-full max-h-[380px] text-slate-700/60" fill="currentColor">
              {/* Simplified world continent outlines */}
              <path d="M150,120 Q200,90 280,110 T320,180 Q300,240 220,250 T130,170 Z" fill="#1e293b" opacity="0.7" />
              <path d="M220,270 Q280,270 300,340 T260,450 Q210,400 200,320 Z" fill="#1e293b" opacity="0.7" />
              <path d="M440,110 Q540,80 580,140 T520,240 Q450,220 430,150 Z" fill="#1e293b" opacity="0.7" />
              <path d="M460,240 Q540,240 560,320 T520,440 Q460,390 440,290 Z" fill="#1e293b" opacity="0.7" />
              <path d="M600,100 Q750,70 850,130 T880,240 Q750,260 630,200 Z" fill="#1e293b" opacity="0.7" />
              <path d="M640,240 Q720,230 750,300 T700,380 Q640,320 630,260 Z" fill="#1e293b" opacity="0.7" />
              <path d="M780,350 Q880,340 890,410 T810,460 Q760,420 770,360 Z" fill="#1e293b" opacity="0.7" />

              {/* Edge connection arcs */}
              <path d="M260,190 Q400,120 490,170" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
              <path d="M490,170 Q580,180 670,260" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
              <path d="M670,260 Q720,280 740,295" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
              <path d="M740,295 Q800,240 840,210" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5" />
            </svg>

            {/* Interactive Node Pins */}
            {filteredNodes.map(node => (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActiveNode(node)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div className={`relative flex items-center justify-center ${activeNode.id === node.id ? 'scale-125' : ''} transition-transform`}>
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75" />
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] px-2.5 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-20 border border-slate-700">
                  <div className="font-bold text-emerald-400">{node.city}</div>
                  <div className="text-[10px] text-slate-300">Ping: {node.latency}</div>
                </div>
              </div>
            ))}

            {/* Map corner label */}
            <div className="absolute bottom-3 right-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-300">
              Global Anycast Routing • 300+ Cities
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
