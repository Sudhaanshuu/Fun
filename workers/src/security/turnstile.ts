/**
 * Server-Side Cloudflare Turnstile Verification
 * Never trusts client results. Verifies cryptographic signature with Cloudflare API.
 */

export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  // Allow test / sandbox token in local development
  if (token.startsWith('cf_ts_') && secretKey.includes('mock')) {
    return { success: true };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = (await res.json()) as TurnstileVerifyResponse;

    if (data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: data['error-codes']?.join(', ') || 'Turnstile token verification failed',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: `Network error verifying Turnstile token: ${err?.message || err}`,
    };
  }
}
