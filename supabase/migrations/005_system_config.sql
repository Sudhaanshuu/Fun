-- ========================================================
-- Migration: 005_system_config.sql
-- Description: System configuration and emergency kill-switch circuit breaker
-- ========================================================

CREATE TABLE IF NOT EXISTS public.system_config (
    id TEXT PRIMARY KEY DEFAULT 'global',
    simulation_enabled BOOLEAN NOT NULL DEFAULT true,
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    global_rate_limit INT NOT NULL DEFAULT 30, -- Max simulations/min
    max_simulations_per_user_hour INT NOT NULL DEFAULT 5,
    max_events_per_target_day INT NOT NULL DEFAULT 3,
    cooldown_seconds INT NOT NULL DEFAULT 15,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on system_config
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read configuration status (e.g. to know if simulator is disabled)
CREATE POLICY "system_config_read_all" ON public.system_config
    FOR SELECT USING (true);

-- Only admins can mutate configuration or trip the kill-switch
CREATE POLICY "system_config_admin_write" ON public.system_config
    FOR ALL USING (public.is_admin());

-- Seed default global configuration
INSERT INTO public.system_config (id, simulation_enabled, maintenance_mode, global_rate_limit, updated_at)
VALUES ('global', true, false, 30, NOW())
ON CONFLICT (id) DO NOTHING;
