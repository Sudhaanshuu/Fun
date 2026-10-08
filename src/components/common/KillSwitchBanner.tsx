import React, { useState, useEffect } from 'react';
import { AlertOctagon, Wrench, ShieldAlert } from 'lucide-react';
import { teleSimStore } from '../../services/store';

export const KillSwitchBanner: React.FC = () => {
  const [config, setConfig] = useState(teleSimStore.getConfig());

  useEffect(() => {
    return teleSimStore.subscribe(() => {
      setConfig(teleSimStore.getConfig());
    });
  }, []);

  if (config.simulation_enabled && !config.maintenance_mode) {
    return null;
  }

  return (
    <aside aria-label="System status alert" className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold shadow-md sticky top-0 z-40 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!config.simulation_enabled ? (
            <>
              <AlertOctagon className="w-4 h-4 text-rose-200 animate-pulse" />
              <span>
                <strong>EMERGENCY KILL-SWITCH ENGAGED:</strong> Simulation service is globally disabled by platform administrators. All new job requests will return 503 Service Unavailable.
              </span>
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4 text-rose-200" />
              <span>
                <strong>MAINTENANCE MODE ACTIVE:</strong> Platform configuration is under maintenance. New simulations temporarily paused.
              </span>
            </>
          )}
        </div>
        <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
          System Guard
        </span>
      </div>
    </aside>
  );
};
