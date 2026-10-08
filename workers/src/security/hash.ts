/**
 * Target Hashing and Privacy Masking in Cloudflare Workers
 * Uses standard Web Crypto API supported by Cloudflare Workers runtime
 */

export function normalizePhoneNumber(rawNumber: string): string {
  return rawNumber.trim().replace(/[\s\-\(\)]/g, '');
}

export function maskPhoneNumber(rawNumber: string): string {
  const cleaned = normalizePhoneNumber(rawNumber);
  if (cleaned.length < 7) {
    return '******';
  }
  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-4);
  const stars = '*'.repeat(Math.max(4, cleaned.length - 7));
  return `${prefix} ${stars}${suffix}`;
}

export async function computeTargetHmac(secret: string, rawNumber: string): Promise<string> {
  const normalized = normalizePhoneNumber(rawNumber);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(normalized);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
