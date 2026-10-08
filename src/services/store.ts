import { 
  User, 
  ConsentRecord, 
  SimulationJob, 
  SimulationType, 
  SimulationStatus, 
  SystemConfig, 
  AuditLog, 
  AbuseReport, 
  AbuseScore 
} from '../types';
import { computeHmac, maskPhoneNumber } from '../lib/crypto';

const STORAGE_KEY_USER = 'telesim_auth_user';
const STORAGE_KEY_CONSENTS = 'telesim_consents';
const STORAGE_KEY_JOBS = 'telesim_jobs';
const STORAGE_KEY_CONFIG = 'telesim_config';
const STORAGE_KEY_AUDIT = 'telesim_audit_logs';
const STORAGE_KEY_ABUSE_REPORTS = 'telesim_abuse_reports';
const STORAGE_KEY_LAST_SIM_TIME = 'telesim_last_sim_time';

const inMemoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return inMemoryStore[key] || null;
  },
  setItem: (key: string, val: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
    inMemoryStore[key] = val;
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
    delete inMemoryStore[key];
  },
  clear: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    for (const k in inMemoryStore) delete inMemoryStore[k];
  }
};

const DEFAULT_SECRET = 'pixir-target-hash-secret-salt-2026';

const DEFAULT_CONFIG: SystemConfig = {
  simulation_enabled: true,
  maintenance_mode: false,
  global_rate_limit: 30, // 30 simulations/min globally
  max_simulations_per_user_hour: 5,
  max_events_per_target_day: 3,
  cooldown_seconds: 15,
  updated_at: new Date().toISOString(),
};

export const DEFAULT_USER: User = {
  id: 'usr_edu_9921',
  email: 'learner@pixir.in',
  display_name: 'Dev Learner',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  role: 'USER',
  status: 'ACTIVE',
  created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  updated_at: new Date().toISOString(),
};

export const ADMIN_USER: User = {
  id: 'usr_adm_0001',
  email: 'admin.security@pixir.in',
  display_name: 'SecOps Lead (Admin)',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  role: 'ADMIN',
  status: 'ACTIVE',
  created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  updated_at: new Date().toISOString(),
};

// Seed initial demo simulation jobs
function getInitialJobs(): SimulationJob[] {
  return [
    {
      id: 'job_sim_8812',
      user_id: 'usr_edu_9921',
      target_masked: '+91 ******4321',
      target_hash: '7a8f3b...e412',
      simulation_type: 'voice',
      requested_count: 2,
      completed_count: 2,
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      started_at: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      country_code: 'IN',
      logs: [
        { timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), state: 'PENDING', message: 'Job queued into Cloudflare serverless dispatcher', carrier_latency_ms: 12 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(), state: 'PROCESSING', message: 'Worker picked up job. Rate limits verified.', carrier_latency_ms: 24 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 43).toISOString(), state: 'RINGING', message: 'SIMULATION — Simulated SIP INVITE sent. Target state: Ringing.', carrier_latency_ms: 45 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), state: 'COMPLETED', message: 'SIMULATION — Synthetic call session completed successfully.', carrier_latency_ms: 18 }
      ]
    },
    {
      id: 'job_sim_8813',
      user_id: 'usr_edu_9921',
      target_masked: '+1 ******8890',
      target_hash: '9c2d1a...f881',
      simulation_type: 'sms',
      requested_count: 1,
      completed_count: 1,
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      started_at: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      country_code: 'US',
      logs: [
        { timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), state: 'PENDING', message: 'SMS job accepted with valid Turnstile proof.', carrier_latency_ms: 15 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(), state: 'PROCESSING', message: 'Simulated SMPP bind established.', carrier_latency_ms: 32 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), state: 'DELIVERED', message: 'SIMULATED SMS — Mock delivery receipt (DLR) acknowledged.', carrier_latency_ms: 21 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), state: 'COMPLETED', message: 'Simulation finished.', carrier_latency_ms: 8 }
      ]
    }
  ];
}

class TeleSimStore {
  private user: User | null = null;
  private consents: Record<string, ConsentRecord> = {};
  private jobs: SimulationJob[] = [];
  private config: SystemConfig = DEFAULT_CONFIG;
  private auditLogs: AuditLog[] = [];
  private abuseReports: AbuseReport[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedUser = safeStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }

      const storedConsents = safeStorage.getItem(STORAGE_KEY_CONSENTS);
      if (storedConsents) {
        this.consents = JSON.parse(storedConsents);
      }

      const storedJobs = safeStorage.getItem(STORAGE_KEY_JOBS);
      if (storedJobs) {
        this.jobs = JSON.parse(storedJobs);
      } else {
        this.jobs = getInitialJobs();
      }

      const storedConfig = safeStorage.getItem(STORAGE_KEY_CONFIG);
      if (storedConfig) {
        this.config = JSON.parse(storedConfig);
      }

      const storedAudit = safeStorage.getItem(STORAGE_KEY_AUDIT);
      if (storedAudit) {
        this.auditLogs = JSON.parse(storedAudit);
      } else {
        this.auditLogs = [
          {
            id: 'aud_001',
            user_id: 'usr_edu_9921',
            user_email: 'learner@pixir.in',
            action: 'USER_LOGIN',
            resource_type: 'AUTH',
            resource_id: 'usr_edu_9921',
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            metadata: { method: 'Google OAuth', provider: 'google.com' }
          },
          {
            id: 'aud_002',
            user_id: 'usr_edu_9921',
            user_email: 'learner@pixir.in',
            action: 'CONSENT_ACCEPTED',
            resource_type: 'CONSENT',
            resource_id: 'cns_9921',
            created_at: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
            metadata: { terms_version: '1.0', privacy_version: '1.0' }
          }
        ];
      }

      const storedReports = safeStorage.getItem(STORAGE_KEY_ABUSE_REPORTS);
      if (storedReports) {
        this.abuseReports = JSON.parse(storedReports);
      }
    } catch (e) {
      console.warn('Error loading TeleSim state from storage:', e);
    }
  }

  private persist() {
    try {
      if (this.user) {
        safeStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
      } else {
        safeStorage.removeItem(STORAGE_KEY_USER);
      }
      safeStorage.setItem(STORAGE_KEY_CONSENTS, JSON.stringify(this.consents));
      safeStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(this.jobs));
      safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
      safeStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLogs));
      safeStorage.setItem(STORAGE_KEY_ABUSE_REPORTS, JSON.stringify(this.abuseReports));
    } catch (e) {
      console.error('Failed to persist TeleSim state:', e);
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Auth & Consent ---
  getUser(): User | null {
    return this.user;
  }

  loginAs(userType: 'USER' | 'ADMIN'): User {
    const user = userType === 'ADMIN' ? { ...ADMIN_USER } : { ...DEFAULT_USER };
    this.user = user;
    this.addAuditLog('USER_LOGIN', 'AUTH', user.id, {
      role: user.role,
      method: 'Google OAuth Simulation',
    });
    this.persist();
    return user;
  }

  logout() {
    if (this.user) {
      this.addAuditLog('USER_LOGIN', 'AUTH', this.user.id, { action: 'logout' });
    }
    this.user = null;
    this.persist();
  }

  hasConsent(userId: string): boolean {
    return Boolean(this.consents[userId]);
  }

  getConsent(userId: string): ConsentRecord | undefined {
    return this.consents[userId];
  }

  recordConsent(userId: string): ConsentRecord {
    const record: ConsentRecord = {
      id: `cns_${Date.now()}`,
      user_id: userId,
      terms_version: '1.0',
      privacy_version: '1.0',
      acceptable_use_version: '1.0',
      accepted_at: new Date().toISOString(),
      ip_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      user_agent_hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    };
    this.consents[userId] = record;
    this.addAuditLog('CONSENT_ACCEPTED', 'CONSENT', record.id, {
      terms_version: '1.0',
      privacy_version: '1.0',
    });
    this.persist();
    return record;
  }

  // --- System Configuration & Kill Switch ---
  getConfig(): SystemConfig {
    return this.config;
  }

  updateConfig(patch: Partial<SystemConfig>, adminUserId: string) {
    this.config = {
      ...this.config,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog('ADMIN_CONFIG_CHANGED', 'SYSTEM_CONFIG', 'global', {
      adminUserId,
      changes: patch,
    });
    this.persist();
  }

  // --- Rate Limiting & Abuse Detection ---
  getUserJobsLastHour(userId: string): number {
    const oneHourAgo = Date.now() - 3600000;
    return this.jobs.filter(
      j => j.user_id === userId && new Date(j.created_at).getTime() > oneHourAgo
    ).length;
  }

  getTargetEventsLast24Hours(targetHash: string): number {
    const oneDayAgo = Date.now() - 86400000;
    return this.jobs.filter(
      j => j.target_hash === targetHash && new Date(j.created_at).getTime() > oneDayAgo
    ).reduce((acc, j) => acc + j.requested_count, 0);
  }

  getActiveJobForUser(userId: string): SimulationJob | undefined {
    return this.jobs.find(
      j => j.user_id === userId && (j.status === 'PENDING' || j.status === 'PROCESSING' || j.status === 'RINGING' || j.status === 'CONNECTED')
    );
  }

  calculateAbuseScore(userId: string): AbuseScore {
    const user = this.user?.id === userId ? this.user : DEFAULT_USER;
    if (user.status === 'SUSPENDED') {
      return { score: 95, level: 'BLOCKED', reasons: ['Account manually suspended by Security Ops'] };
    }

    const userJobs = this.jobs.filter(j => j.user_id === userId);
    const jobsLastHour = this.getUserJobsLastHour(userId);
    let score = 5; // Base normal score
    const reasons: string[] = ['Standard verified usage baseline'];

    if (jobsLastHour >= 4) {
      score += 35;
      reasons.push('High request frequency close to hourly threshold');
    }

    const distinctTargets = new Set(userJobs.map(j => j.target_hash)).size;
    if (distinctTargets > 10) {
      score += 25;
      reasons.push('High target diversity index');
    }

    if (score <= 30) {
      return { score, level: 'NORMAL', reasons };
    } else if (score <= 60) {
      return { score, level: 'REVIEW', reasons };
    } else if (score <= 80) {
      return { score, level: 'RESTRICTED', reasons };
    } else {
      return { score, level: 'BLOCKED', reasons };
    }
  }

  // --- Simulation Creation & Execution ---
  async createSimulationJob(params: {
    userId: string;
    targetRaw: string;
    simulationType: SimulationType;
    requestedCount: number;
    turnstileToken: string;
  }): Promise<{ job?: SimulationJob; error?: { code: string; message: string } }> {
    // 1. Global Kill Switch Check
    if (!this.config.simulation_enabled) {
      return {
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Simulation service is temporarily disabled by platform administration.',
        },
      };
    }

    if (this.config.maintenance_mode) {
      return {
        error: {
          code: 'MAINTENANCE_MODE',
          message: 'Platform is in maintenance mode. Simulation creation is paused.',
        },
      };
    }

    // 2. Authentication Check
    if (!this.user || this.user.id !== params.userId) {
      return {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to dispatch simulations.',
        },
      };
    }

    // 3. User Consent Check
    if (!this.hasConsent(params.userId)) {
      return {
        error: {
          code: 'CONSENT_REQUIRED',
          message: 'Responsible Use Agreement must be accepted before launching simulations.',
        },
      };
    }

    // 4. Turnstile Validation
    if (!params.turnstileToken || params.turnstileToken.length < 5) {
      this.addAuditLog('TURNSTILE_FAILED', 'SIMULATION', 'turnstile_verification', {
        userId: params.userId,
      });
      return {
        error: {
          code: 'TURNSTILE_FAILED',
          message: 'Cloudflare Turnstile verification challenge failed. Please retry.',
        },
      };
    }

    // 5. Input Bounds Check (Max count <= 5)
    if (params.requestedCount < 1 || params.requestedCount > 5) {
      return {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Simulation count must be between 1 and 5.',
        },
      };
    }

    // 6. Concurrent Job Check (Max 1 active job per user)
    const activeJob = this.getActiveJobForUser(params.userId);
    if (activeJob) {
      return {
        error: {
          code: 'CONCURRENT_JOB_RUNNING',
          message: `You already have an active simulation (${activeJob.id}). Wait for it to complete.`,
        },
      };
    }

    // 7. Per-User Rate Limit Check
    const hourlyJobs = this.getUserJobsLastHour(params.userId);
    if (hourlyJobs >= this.config.max_simulations_per_user_hour) {
      this.addAuditLog('RATE_LIMIT_TRIGGERED', 'RATE_LIMIT', params.userId, {
        limit: this.config.max_simulations_per_user_hour,
        window: '1h',
      });
      return {
        error: {
          code: 'RATE_LIMITED',
          message: `User limit reached (${this.config.max_simulations_per_user_hour} jobs/hour). Please wait.`,
        },
      };
    }

    // 8. Privacy Hashing & Per-Target Limit Check
    const targetHash = await computeHmac(DEFAULT_SECRET, params.targetRaw);
    const targetEvents24h = this.getTargetEventsLast24Hours(targetHash);
    if (targetEvents24h + params.requestedCount > this.config.max_events_per_target_day) {
      return {
        error: {
          code: 'TARGET_LIMIT_EXCEEDED',
          message: `Anti-abuse target limit reached (Max ${this.config.max_events_per_target_day} events/day for this identifier).`,
        },
      };
    }

    // 9. Cooldown Enforcement
    const lastSimTimeStr = safeStorage.getItem(STORAGE_KEY_LAST_SIM_TIME);
    if (lastSimTimeStr) {
      const elapsedSeconds = (Date.now() - parseInt(lastSimTimeStr, 10)) / 1000;
      if (elapsedSeconds < this.config.cooldown_seconds) {
        const remaining = Math.ceil(this.config.cooldown_seconds - elapsedSeconds);
        return {
          error: {
            code: 'COOLDOWN_ACTIVE',
            message: `Platform cooldown active. Please wait ${remaining}s before next simulation.`,
          },
        };
      }
    }

    // Create the simulation job
    const masked = maskPhoneNumber(params.targetRaw);
    const jobId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newJob: SimulationJob = {
      id: jobId,
      user_id: params.userId,
      target_masked: masked,
      target_hash: targetHash,
      simulation_type: params.simulationType,
      requested_count: params.requestedCount,
      completed_count: 0,
      status: 'PENDING',
      created_at: nowIso,
      country_code: params.targetRaw.startsWith('+91') ? 'IN' : params.targetRaw.startsWith('+1') ? 'US' : 'GLOBAL',
      logs: [
        {
          timestamp: nowIso,
          state: 'PENDING',
          message: 'Simulation request validated. Ingested into serverless event queue.',
          carrier_latency_ms: 14,
        },
      ],
    };

    this.jobs.unshift(newJob);
    safeStorage.setItem(STORAGE_KEY_LAST_SIM_TIME, Date.now().toString());
    this.addAuditLog('SIMULATION_CREATED', 'SIMULATION_JOB', jobId, {
      simulation_type: params.simulationType,
      count: params.requestedCount,
    });
    this.persist();

    // Trigger asynchronous simulation engine
    this.runSimulationEngine(jobId);

    return { job: newJob };
  }

  // Asynchronous Simulation Provider runner
  private async runSimulationEngine(jobId: string) {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return;

    // Transition to PROCESSING
    await new Promise(res => setTimeout(res, 1200));
    let job = this.jobs[jobIndex];
    if (job.status === 'CANCELLED') return;

    job.status = 'PROCESSING';
    job.started_at = new Date().toISOString();
    job.logs.push({
      timestamp: new Date().toISOString(),
      state: 'PROCESSING',
      message: 'Worker dequeued job. Binding synthetic telecom session...',
      carrier_latency_ms: 22,
    });
    this.persist();

    // Voice / SMS State Simulation
    if (job.simulation_type === 'voice' || job.simulation_type === 'voice_sms') {
      await new Promise(res => setTimeout(res, 1800));
      job = this.jobs[jobIndex];
      if (job.status === 'CANCELLED') return;

      job.status = 'RINGING';
      job.logs.push({
        timestamp: new Date().toISOString(),
        state: 'RINGING',
        message: 'SIMULATION — Synthetic SIP 180 Ringing. No real network dialed.',
        carrier_latency_ms: 48,
      });
      this.persist();

      await new Promise(res => setTimeout(res, 2200));
      job = this.jobs[jobIndex];
      if (job.status === 'CANCELLED') return;

      job.status = 'CONNECTED';
      job.logs.push({
        timestamp: new Date().toISOString(),
        state: 'CONNECTED',
        message: 'SIMULATION — Mock audio stream handshake established (200 OK).',
        carrier_latency_ms: 36,
      });
      this.persist();
    }

    if (job.simulation_type === 'sms' || job.simulation_type === 'voice_sms') {
      await new Promise(res => setTimeout(res, 1500));
      job = this.jobs[jobIndex];
      if (job.status === 'CANCELLED') return;

      job.status = 'DELIVERED';
      job.logs.push({
        timestamp: new Date().toISOString(),
        state: 'DELIVERED',
        message: 'SIMULATED SMS — Fake SMPP SUBMIT_SM acknowledged. Delivery receipt generated.',
        carrier_latency_ms: 19,
      });
      this.persist();
    }

    // Complete Job
    await new Promise(res => setTimeout(res, 1400));
    job = this.jobs[jobIndex];
    if (job.status === 'CANCELLED') return;

    job.status = 'COMPLETED';
    job.completed_count = job.requested_count;
    job.completed_at = new Date().toISOString();
    job.logs.push({
      timestamp: new Date().toISOString(),
      state: 'COMPLETED',
      message: 'SIMULATION COMPLETED — Educational telemetry stream archived. No carrier charges incurred.',
      carrier_latency_ms: 11,
    });

    this.addAuditLog('SIMULATION_COMPLETED', 'SIMULATION_JOB', jobId, {
      completed_count: job.completed_count,
    });
    this.persist();
  }

  cancelSimulation(jobId: string, userId: string): boolean {
    const job = this.jobs.find(j => j.id === jobId && j.user_id === userId);
    if (!job) return false;
    if (job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
      return false;
    }

    job.status = 'CANCELLED';
    job.completed_at = new Date().toISOString();
    job.failure_reason = 'Cancelled by user request';
    job.logs.push({
      timestamp: new Date().toISOString(),
      state: 'CANCELLED',
      message: 'Simulation terminated by user command.',
      carrier_latency_ms: 5,
    });
    this.addAuditLog('SIMULATION_CANCELLED', 'SIMULATION_JOB', jobId, {});
    this.persist();
    return true;
  }

  getJobs(userId?: string): SimulationJob[] {
    if (!userId) return [...this.jobs];
    return this.jobs.filter(j => j.user_id === userId);
  }

  getJobById(id: string): SimulationJob | undefined {
    return this.jobs.find(j => j.id === id);
  }

  // --- Audit Logs ---
  getAuditLogs(userId?: string): AuditLog[] {
    if (userId) {
      return this.auditLogs.filter(a => a.user_id === userId);
    }
    return [...this.auditLogs];
  }

  private addAuditLog(
    action: AuditLog['action'],
    resource_type: string,
    resource_id: string,
    metadata?: Record<string, any>
  ) {
    const log: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: this.user?.id || 'system',
      user_email: this.user?.email,
      action,
      resource_type,
      resource_id,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  // --- Abuse Reports ---
  getAbuseReports(): AbuseReport[] {
    return [...this.abuseReports];
  }

  submitAbuseReport(report: Omit<AbuseReport, 'id' | 'status' | 'created_at'>): AbuseReport {
    const newReport: AbuseReport = {
      id: `rep_${Date.now()}`,
      ...report,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    this.abuseReports.unshift(newReport);
    this.persist();
    return newReport;
  }

  updateReportStatus(reportId: string, status: AbuseReport['status']): boolean {
    const rep = this.abuseReports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    if (status === 'RESOLVED' || status === 'DISMISSED') {
      rep.resolved_at = new Date().toISOString();
    }
    this.persist();
    return true;
  }

  // --- Account Deletion / Export ---
  exportUserData(userId: string): string {
    const data = {
      user: this.user,
      consent: this.consents[userId],
      simulations: this.jobs.filter(j => j.user_id === userId),
      auditLogs: this.auditLogs.filter(a => a.user_id === userId),
      exported_at: new Date().toISOString(),
    };
    this.addAuditLog('DATA_EXPORTED', 'USER', userId, {});
    this.persist();
    return JSON.stringify(data, null, 2);
  }

  deleteUserAccount(userId: string) {
    this.addAuditLog('ACCOUNT_DELETED', 'USER', userId, {});
    delete this.consents[userId];
    this.jobs = this.jobs.filter(j => j.user_id !== userId);
    this.user = null;
    this.persist();
  }
}

export const teleSimStore = new TeleSimStore();
