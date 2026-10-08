-- ========================================================
-- Migration: 004_audit_logs.sql
-- Description: Audit logs and abuse reporting tables with RLS
-- ========================================================

-- 1. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_all" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

CREATE POLICY "audit_logs_user_own" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "audit_logs_insert" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- 2. Abuse Reports Table
CREATE TABLE IF NOT EXISTS public.abuse_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id TEXT,
    reporter_email TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('Unauthorized use', 'Harassment', 'Suspicious activity', 'Privacy concern', 'Other')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON public.abuse_reports(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_created_at ON public.abuse_reports(created_at DESC);

-- Enable RLS on abuse_reports
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "abuse_reports_admin_select" ON public.abuse_reports
    FOR SELECT USING (public.is_admin());

CREATE POLICY "abuse_reports_admin_update" ON public.abuse_reports
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "abuse_reports_insert_public" ON public.abuse_reports
    FOR INSERT WITH CHECK (true);
