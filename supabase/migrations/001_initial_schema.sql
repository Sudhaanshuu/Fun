-- ========================================================
-- Migration: 001_initial_schema.sql
-- Description: Core tables for users, consents, and simulation jobs
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Linked to auth.users in Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESTRICTED', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Consents Table (Mandatory First-Time Responsible Use Agreement)
CREATE TABLE IF NOT EXISTS public.consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    terms_version TEXT NOT NULL,
    privacy_version TEXT NOT NULL,
    acceptable_use_version TEXT NOT NULL,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash TEXT NOT NULL,
    user_agent_hash TEXT NOT NULL,
    CONSTRAINT unique_user_consent UNIQUE (user_id)
);

-- 3. Simulation Jobs Table
CREATE TABLE IF NOT EXISTS public.simulation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_masked TEXT NOT NULL, -- e.g. +91 ******4321
    target_hash TEXT NOT NULL,   -- HMAC-SHA256(secret, target)
    simulation_type TEXT NOT NULL CHECK (simulation_type IN ('voice', 'sms', 'voice_sms')),
    requested_count INT NOT NULL DEFAULT 1 CHECK (requested_count >= 1 AND requested_count <= 5),
    completed_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'RINGING', 'CONNECTED', 'DELIVERED', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failure_reason TEXT,
    country_code TEXT DEFAULT 'GLOBAL',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Simulation Step Logs Table
CREATE TABLE IF NOT EXISTS public.simulation_step_logs (
    id BIGSERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.simulation_jobs(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    message TEXT NOT NULL,
    carrier_latency_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
