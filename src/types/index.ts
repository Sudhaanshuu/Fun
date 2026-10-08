export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  terms_version: string;
  privacy_version: string;
  acceptable_use_version: string;
  accepted_at: string;
  ip_hash: string;
  user_agent_hash: string;
}

export type SimulationType = 'voice' | 'sms' | 'voice_sms';

export type SimulationStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'RINGING'
  | 'CONNECTED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELLED';

export interface SimulationStepLog {
  timestamp: string;
  state: SimulationStatus;
  message: string;
  carrier_latency_ms: number;
}

export interface SimulationJob {
  id: string;
  user_id: string;
  target_masked: string; // e.g. +91 ******4321 (never expose raw number)
  target_hash: string;   // HMAC-SHA256
  simulation_type: SimulationType;
  requested_count: number;
  completed_count: number;
  status: SimulationStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  failure_reason?: string;
  logs: SimulationStepLog[];
  country_code?: string;
}

export type RiskLevel = 'NORMAL' | 'REVIEW' | 'RESTRICTED' | 'BLOCKED';

export interface AbuseScore {
  score: number; // 0-100
  level: RiskLevel;
  reasons: string[];
}

export interface SystemConfig {
  simulation_enabled: boolean;
  maintenance_mode: boolean;
  global_rate_limit: number; // Max simulations per minute
  max_simulations_per_user_hour: number;
  max_events_per_target_day: number;
  cooldown_seconds: number;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email?: string;
  action: 
    | 'USER_LOGIN'
    | 'CONSENT_ACCEPTED'
    | 'SIMULATION_CREATED'
    | 'SIMULATION_STARTED'
    | 'SIMULATION_COMPLETED'
    | 'SIMULATION_CANCELLED'
    | 'RATE_LIMIT_TRIGGERED'
    | 'TURNSTILE_FAILED'
    | 'ACCOUNT_BLOCKED'
    | 'ADMIN_CONFIG_CHANGED'
    | 'DATA_EXPORTED'
    | 'ACCOUNT_DELETED';
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AbuseReport {
  id: string;
  simulation_id?: string;
  reporter_email: string;
  reason: 'Unauthorized use' | 'Harassment' | 'Suspicious activity' | 'Privacy concern' | 'Other';
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
  resolved_at?: string;
}
