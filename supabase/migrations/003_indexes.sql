-- ========================================================
-- Migration: 003_indexes.sql
-- Description: Indexes for rate-limit lookups and target anti-flooding
-- ========================================================

-- Indexes on simulation_jobs
CREATE INDEX IF NOT EXISTS idx_simulation_jobs_user_id ON public.simulation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_jobs_target_hash ON public.simulation_jobs(target_hash);
CREATE INDEX IF NOT EXISTS idx_simulation_jobs_status ON public.simulation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_simulation_jobs_created_at ON public.simulation_jobs(created_at DESC);

-- Composite Index for fast per-user hourly rate limit checks
CREATE INDEX IF NOT EXISTS idx_sim_jobs_user_hourly ON public.simulation_jobs(user_id, created_at DESC);

-- Composite Index for fast per-target daily quota checks
CREATE INDEX IF NOT EXISTS idx_sim_jobs_target_daily ON public.simulation_jobs(target_hash, created_at DESC);

-- Index on simulation_step_logs
CREATE INDEX IF NOT EXISTS idx_sim_step_logs_job_id ON public.simulation_step_logs(job_id);

-- Index on consents
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON public.consents(user_id);
