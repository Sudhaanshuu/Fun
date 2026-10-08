/**
 * Cryptographic & Privacy Utilities
 * Strict privacy-by-design: Never persist raw phone numbers in logs or databases.
 */

// Masks phone number, e.g. +91 9876543210 -> +91 ******3210
export function maskPhoneNumber(rawNumber: string): string {
  const cleaned = rawNumber.trim().replace(/\s+/g, '');
  if (cleaned.length < 7) {
    return '******';
  }
  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-4);
  const stars = '*'.repeat(Math.max(4, cleaned.length - 7));
  return `${prefix} ${stars}${suffix}`;
}

// Validates international E.164 phone number format (+[1-9][0-9]{6,14})
export function isValidE164(phone: string): boolean {
  const cleaned = phone.trim().replace(/\s+/g, '');
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  return e164Regex.test(cleaned);
}

// Compute SHA-256 hash in browser or Node via Web Crypto API
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compute HMAC-SHA256 for target identification
export async function computeHmac(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message.trim().replace(/\s+/g, ''));
  
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
