import { describe, it, expect, beforeEach } from 'vitest';
import { teleSimStore, safeStorage, DEFAULT_USER, ADMIN_USER } from '../src/services/store';
import { isValidE164, maskPhoneNumber, computeHmac } from '../src/lib/crypto';
import { SimulationProvider } from '../workers/src/simulation/SimulationProvider';
import { evaluateAbuseRisk } from '../workers/src/security/abuseDetection';

describe('Serverless Telecom Simulation Test Suite', () => {
  beforeEach(() => {
    safeStorage.clear();
    teleSimStore.logout();
  });

  // 1. Privacy & Hashing
  it('masks telephone numbers to protect recipient privacy', () => {
    const raw = '+919876543210';
    const masked = maskPhoneNumber(raw);
    expect(masked).toBe('+91 ******3210');
    expect(masked).not.toContain('987654');
  });

  it('validates standard international E.164 phone formats', () => {
    expect(isValidE164('+919876543210')).toBe(true);
    expect(isValidE164('+12025550143')).toBe(true);
    expect(isValidE164('9876543210')).toBe(false); // Missing '+'
    expect(isValidE164('+0123')).toBe(false); // Too short
  });

  it('computes irreversible HMAC-SHA256 for target identification', async () => {
    const secret = 'test-secret-salt';
    const hash1 = await computeHmac(secret, '+919876543210');
    const hash2 = await computeHmac(secret, '+919876543210');
    const hash3 = await computeHmac(secret, '+12025550143');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64); // SHA-256 hex length
  });

  // 2. Simulation Provider Lifecycle (Section 10)
  it('SimulationProvider generates synthetic voice call events without dialing carriers', () => {
    const events = SimulationProvider.simulateCall({
      jobId: 'sim_test_01',
      targetMasked: '+91 ******3210',
      count: 2,
    });

    expect(events.length).toBe(4);
    expect(events[0].state).toBe('CALL_CREATED');
    expect(events[1].state).toBe('CALL_RINGING');
    expect(events[2].state).toBe('CALL_CONNECTED');
    expect(events[3].state).toBe('CALL_COMPLETED');
    expect(events[1].message).toContain('SIMULATION');
  });

  it('SimulationProvider generates synthetic SMS events without sending real messages', () => {
    const events = SimulationProvider.simulateSMS({
      jobId: 'sim_test_02',
      targetMasked: '+91 ******3210',
      count: 1,
    });

    expect(events.length).toBe(3);
    expect(events[0].state).toBe('SMS_CREATED');
    expect(events[1].state).toBe('SMS_QUEUED');
    expect(events[2].state).toBe('SMS_DELIVERED');
    expect(events[2].message).toContain('SIMULATED SMS');
  });

  // 3. Security: Turnstile Requirement (Section 9)
  it('rejects simulation creation when Turnstile verification token is missing', async () => {
    const user = teleSimStore.loginAs('USER');
    teleSimStore.recordConsent(user.id);

    const result = await teleSimStore.createSimulationJob({
      userId: user.id,
      targetRaw: '+919876543210',
      simulationType: 'voice',
      requestedCount: 1,
      turnstileToken: '', // Missing token
    });

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('TURNSTILE_FAILED');
  });

  // 4. Rate Limiting Enforcements (Section 12)
  it('prevents job creation when request count exceeds maximum bound of 5', async () => {
    const user = teleSimStore.loginAs('USER');
    teleSimStore.recordConsent(user.id);

    const result = await teleSimStore.createSimulationJob({
      userId: user.id,
      targetRaw: '+919876543210',
      simulationType: 'voice',
      requestedCount: 10, // Exceeds limit
      turnstileToken: 'valid-turnstile-token-mock',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('INVALID_REQUEST');
  });

  it('prevents concurrent simulations for a single user', async () => {
    const user = teleSimStore.loginAs('USER');
    teleSimStore.recordConsent(user.id);

    // First simulation
    const first = await teleSimStore.createSimulationJob({
      userId: user.id,
      targetRaw: '+919876543210',
      simulationType: 'voice',
      requestedCount: 1,
      turnstileToken: 'valid-turnstile-token-mock',
    });
    expect(first.job).toBeDefined();

    // Second simulation immediately while first is running
    const second = await teleSimStore.createSimulationJob({
      userId: user.id,
      targetRaw: '+919876543210',
      simulationType: 'sms',
      requestedCount: 1,
      turnstileToken: 'valid-turnstile-token-mock',
    });
    expect(second.error).toBeDefined();
    expect(second.error?.code).toBe('CONCURRENT_JOB_RUNNING');
  });

  // 5. Emergency Kill Switch (Section 14)
  it('returns 503 SERVICE_UNAVAILABLE when global kill switch is engaged', async () => {
    const admin = teleSimStore.loginAs('ADMIN');
    teleSimStore.updateConfig({ simulation_enabled: false }, admin.id);

    const user = teleSimStore.loginAs('USER');
    teleSimStore.recordConsent(user.id);

    const result = await teleSimStore.createSimulationJob({
      userId: user.id,
      targetRaw: '+919876543210',
      simulationType: 'voice',
      requestedCount: 1,
      turnstileToken: 'valid-token',
    });

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('SERVICE_UNAVAILABLE');
  });

  // 6. Abuse Detection & Risk Scoring (Section 13)
  it('calculates elevated risk scores for suspicious patterns', () => {
    const normal = evaluateAbuseRisk({
      requestsInLastHour: 1,
      distinctTargetsCount: 1,
      failedTurnstileAttempts: 0,
      blockedRequestsCount: 0,
      isSuspended: false,
    });
    expect(normal.level).toBe('NORMAL');
    expect(normal.score).toBeLessThanOrEqual(30);

    const abusive = evaluateAbuseRisk({
      requestsInLastHour: 6,
      distinctTargetsCount: 12,
      failedTurnstileAttempts: 4,
      blockedRequestsCount: 5,
      isSuspended: false,
    });
    expect(abusive.level).toBe('BLOCKED');
    expect(abusive.score).toBeGreaterThan(80);
  });

  // 7. Tenant Isolation & User Access Control (Section 20)
  it('ensures users can only query their own simulations', () => {
    const userA = teleSimStore.loginAs('USER');
    const jobsUserA = teleSimStore.getJobs(userA.id);
    jobsUserA.forEach(job => {
      expect(job.user_id).toBe(userA.id);
    });
  });

  // 8. Account Deletion (Section 18)
  it('properly purges user consent and simulations upon account deletion', () => {
    const user = teleSimStore.loginAs('USER');
    teleSimStore.recordConsent(user.id);
    expect(teleSimStore.hasConsent(user.id)).toBe(true);

    teleSimStore.deleteUserAccount(user.id);
    expect(teleSimStore.getUser()).toBeNull();
    expect(teleSimStore.hasConsent(user.id)).toBe(false);
  });
});
