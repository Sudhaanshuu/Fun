/**
 * Security Headers and Strict CORS Middleware for Cloudflare Workers
 * Requirement 25: Strict CORS, CSP, HSTS, X-Content-Type-Options
 */

export function getSecurityHeaders(allowedOrigin: string = 'https://app.pixir.in'): Headers {
  const headers = new Headers();

  // Strict CORS — only allow the specific frontend subdomain
  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Turnstile-Token');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Max-Age', '86400');

  // Hardened Security Headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://api.pixir.in https://*.supabase.co;"
  );

  return headers;
}
