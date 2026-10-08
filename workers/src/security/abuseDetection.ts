/**
 * Abuse Detection & Risk Scoring Algorithm
 * Requirement 13: Multi-signal risk score calculation
 */

export interface AbuseSignals {
  requestsInLastHour: number;
  distinctTargetsCount: number;
  failedTurnstileAttempts: number;
  blockedRequestsCount: number;
  isSuspended: boolean;
}

export type RiskLevel = 'NORMAL' | 'REVIEW' | 'RESTRICTED' | 'BLOCKED';

export interface AbuseAnalysisResult {
  score: number; // 0 - 100
  level: RiskLevel;
  reasons: string[];
}

export function evaluateAbuseRisk(signals: AbuseSignals): AbuseAnalysisResult {
  if (signals.isSuspended) {
    return {
      score: 100,
      level: 'BLOCKED',
      reasons: ['Account explicitly suspended by SecOps'],
    };
  }

  let score = 5; // Verified baseline
  const reasons: string[] = ['Standard verified usage'];

  // Signal 1: High request frequency
  if (signals.requestsInLastHour >= 5) {
    score += 35;
    reasons.push('High request frequency approaching user hourly limit');
  } else if (signals.requestsInLastHour >= 3) {
    score += 15;
  }

  // Signal 2: Target number diversity
  if (signals.distinctTargetsCount >= 10) {
    score += 30;
    reasons.push('Anomalously high target number diversity');
  } else if (signals.distinctTargetsCount >= 5) {
    score += 10;
  }

  // Signal 3: Failed Turnstile challenges (bot indicator)
  if (signals.failedTurnstileAttempts >= 3) {
    score += 40;
    reasons.push('Multiple failed Turnstile challenges detected');
  } else if (signals.failedTurnstileAttempts >= 1) {
    score += 15;
  }

  // Signal 4: Repeated blocked / rate-limited attempts
  if (signals.blockedRequestsCount >= 4) {
    score += 25;
    reasons.push('Repeated violations of rate limit barriers');
  }

  // Cap score to 100
  score = Math.min(100, score);

  let level: RiskLevel = 'NORMAL';
  if (score > 80) {
    level = 'BLOCKED';
  } else if (score > 60) {
    level = 'RESTRICTED';
  } else if (score > 30) {
    level = 'REVIEW';
  }

  return { score, level, reasons };
}
