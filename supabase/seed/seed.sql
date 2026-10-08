-- ========================================================
-- Seed Data: seed.sql
-- ========================================================

-- Seed initial admin and test learner
INSERT INTO public.users (id, email, display_name, role, status, created_at, updated_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'admin.security@pixir.in', 'SecOps Lead (Admin)', 'ADMIN', 'ACTIVE', NOW() - INTERVAL '30 days', NOW()),
    ('b0000000-0000-0000-0000-000000000002', 'learner@pixir.in', 'Dev Learner', 'USER', 'ACTIVE', NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed consent for the demo learner
INSERT INTO public.consents (id, user_id, terms_version, privacy_version, acceptable_use_version, ip_hash, user_agent_hash, accepted_at)
VALUES (
    uuid_generate_v4(),
    'b0000000-0000-0000-0000-000000000002',
    '1.0',
    '1.0',
    '1.0',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    NOW() - INTERVAL '5 days'
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed system configuration
INSERT INTO public.system_config (id, simulation_enabled, maintenance_mode, global_rate_limit, max_simulations_per_user_hour, max_events_per_target_day, cooldown_seconds, updated_at)
VALUES ('global', true, false, 30, 5, 3, 15, NOW())
ON CONFLICT (id) DO UPDATE SET simulation_enabled = true;
