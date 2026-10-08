/**
 * Cloudflare Worker API for Serverless Call & SMS Simulation Learning Platform
 * Domain: api.pixir.in (Serving app.pixir.in)
 */

import { getSecurityHeaders } from './security/headers';
import { verifyTurnstileToken } from './security/turnstile';
import { computeTargetHmac, maskPhoneNumber, normalizePhoneNumber } from './security/hash';
import { SimulationProvider } from './simulation/SimulationProvider';
import { evaluateAbuseRisk } from './security/abuseDetection';

export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TARGET_HASH_SECRET?: string;
  ADMIN_SECRET?: string;
}

// In-memory state storage simulation for serverless edge demonstration
let simulationEnabled = true;
let maintenanceMode = false;

function jsonResponse(data: any, status = 200, origin = 'https://app.pixir.in'): Response {
  const headers = getSecurityHeaders(origin);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(code: string, message: string, status = 400, origin = 'https://app.pixir.in'): Response {
  return jsonResponse(
    {
      success: false,
      error: { code, message },
    },
    status,
    origin
  );
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') || 'https://app.pixir.in';
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getSecurityHeaders(origin),
      });
    }

    try {
      // 1. Health check
      if (url.pathname === '/api/health' || url.pathname === '/') {
        return jsonResponse({
          success: true,
          data: {
            service: 'TeleSim Worker Edge',
            status: simulationEnabled ? 'OPERATIONAL' : 'DISABLED',
            maintenance: maintenanceMode,
            timestamp: new Date().toISOString(),
          },
        }, 200, origin);
      }

      // 2. Global Kill Switch verification
      if (!simulationEnabled && url.pathname.startsWith('/api/simulations') && request.method === 'POST') {
        return errorResponse(
          'SERVICE_UNAVAILABLE',
          'Simulation service is temporarily disabled.',
          503,
          origin
        );
      }

      // 3. User Identity Endpoint
      if (url.pathname === '/api/me' && request.method === 'GET') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          return errorResponse('UNAUTHORIZED', 'Authentication required.', 401, origin);
        }
        return jsonResponse({
          success: true,
          data: {
            id: 'usr_edu_9921',
            email: 'learner@pixir.in',
            display_name: 'Dev Learner',
            role: 'USER',
            status: 'ACTIVE',
          },
        }, 200, origin);
      }

      // 4. Turnstile Direct Verification
      if (url.pathname === '/api/turnstile/verify' && request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const token = body.turnstileToken || body.token;
        const secret = env.TURNSTILE_SECRET_KEY || 'mock-turnstile-secret';
        const clientIp = request.headers.get('CF-Connecting-IP') || undefined;

        const verification = await verifyTurnstileToken(token, secret, clientIp);
        if (!verification.success) {
          return errorResponse('TURNSTILE_FAILED', verification.error || 'Challenge failed', 400, origin);
        }

        return jsonResponse({ success: true, data: { verified: true } }, 200, origin);
      }

      // 5. Create Simulation Job
      if (url.pathname === '/api/simulations' && request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        const { target, type, count, turnstileToken } = body;

        // Validation 1: Target format
        if (!target || !/^\+[1-9]\d{6,14}$/.test(normalizePhoneNumber(target))) {
          return errorResponse('INVALID_TARGET', 'Invalid E.164 phone number format.', 422, origin);
        }

        // Validation 2: Turnstile token
        if (!turnstileToken) {
          return errorResponse('TURNSTILE_REQUIRED', 'Cloudflare Turnstile token required.', 400, origin);
        }

        // Validation 3: Count limits
        const simulationCount = Number(count) || 1;
        if (simulationCount < 1 || simulationCount > 5) {
          return errorResponse('INVALID_COUNT', 'Simulation count must be between 1 and 5.', 422, origin);
        }

        // Validation 4: Privacy-preserving target HMAC
        const secret = env.TARGET_HASH_SECRET || 'serverless-secret-salt-2026';
        const targetHash = await computeTargetHmac(secret, target);
        const masked = maskPhoneNumber(target);
        const jobId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // Execute synthetic simulation events
        let events = [];
        if (type === 'sms') {
          events = SimulationProvider.simulateSMS({ jobId, targetMasked: masked, count: simulationCount });
        } else if (type === 'voice_sms') {
          events = SimulationProvider.simulateVoiceAndSMS({ jobId, targetMasked: masked, count: simulationCount });
        } else {
          events = SimulationProvider.simulateCall({ jobId, targetMasked: masked, count: simulationCount });
        }

        return jsonResponse(
          {
            success: true,
            data: {
              jobId,
              targetMasked: masked,
              targetHash,
              simulationType: type || 'voice',
              requestedCount: simulationCount,
              status: 'COMPLETED',
              events,
              disclaimer: 'SIMULATION — NO REAL CALL OR SMS SENT',
            },
          },
          201,
          origin
        );
      }

      // 6. Abuse Reporting Endpoint
      if (url.pathname === '/api/report-abuse' && request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as any;
        if (!body.reporter_email || !body.description) {
          return errorResponse('VALIDATION_ERROR', 'Reporter email and description required.', 422, origin);
        }
        return jsonResponse(
          {
            success: true,
            data: {
              reportId: `rep_${Date.now()}`,
              status: 'PENDING',
              message: 'Incident queued for SecOps review.',
            },
          },
          201,
          origin
        );
      }

      // 7. Admin Toggle Kill Switch
      if (url.pathname === '/api/admin/system/toggle' && request.method === 'POST') {
        const adminSecret = request.headers.get('X-Admin-Secret');
        if (adminSecret !== (env.ADMIN_SECRET || 'admin-secret-pixir-edu')) {
          return errorResponse('FORBIDDEN', 'Administrative privilege required.', 403, origin);
        }
        simulationEnabled = !simulationEnabled;
        return jsonResponse({
          success: true,
          data: {
            simulation_enabled: simulationEnabled,
            updated_at: new Date().toISOString(),
          },
        }, 200, origin);
      }

      // 8. Admin Risk Scoring Inspection
      if (url.pathname === '/api/admin/risk-score' && request.method === 'GET') {
        const risk = evaluateAbuseRisk({
          requestsInLastHour: 2,
          distinctTargetsCount: 3,
          failedTurnstileAttempts: 0,
          blockedRequestsCount: 0,
          isSuspended: false,
        });
        return jsonResponse({ success: true, data: risk }, 200, origin);
      }

      // Default 404
      return errorResponse('NOT_FOUND', `Route ${url.pathname} not found on simulation API.`, 404, origin);
    } catch (err: any) {
      console.error('Worker runtime error:', err);
      return errorResponse('INTERNAL_ERROR', 'An unexpected server error occurred.', 500, origin);
    }
  },
};
