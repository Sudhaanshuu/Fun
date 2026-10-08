-- ========================================================
-- Migration: 002_rls.sql
-- Description: Row Level Security policies protecting tenant isolation
-- ========================================================

-- Enable RLS on all primary tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_step_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to evaluate admin role securely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Users Policies
-- Users can view and update their own record
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 2. Consents Policies
CREATE POLICY "consents_select_own" ON public.consents
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "consents_insert_own" ON public.consents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Simulation Jobs Policies
-- Users can only view their own simulation jobs; admins can view all
CREATE POLICY "simulation_jobs_select" ON public.simulation_jobs
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "simulation_jobs_insert" ON public.simulation_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "simulation_jobs_update" ON public.simulation_jobs
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- 4. Simulation Step Logs Policies
CREATE POLICY "simulation_step_logs_select" ON public.simulation_step_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.simulation_jobs j
            WHERE j.id = simulation_step_logs.job_id
            AND (j.user_id = auth.uid() OR public.is_admin())
        )
    );
