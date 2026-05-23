interface TokenResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface DecodedToken {
  sub: string;
  email: string;
  'custom:store_id'?: string;
  [key: string]: any;
}

const COGNITO_DOMAIN = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com';
const CLIENT_ID = '12nf22nqg8mpcq1q77nm5uqbls';
const REDIRECT_URI = 'https://admin-lp.neural-seeds.com';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJWT(token: string): DecodedToken {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  const payload = base64UrlDecode(parts[1]);
  return JSON.parse(payload);
}

export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code: code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

export function getStoreIdFromToken(idToken: string): string | null {
  try {
    const decoded = decodeJWT(idToken);
    console.log('=== DEBUG: Token Decoded ===');
    console.log('Full decoded token:', decoded);
    console.log('Keys in token:', Object.keys(decoded));
    console.log('custom:store_id value:', decoded['custom:store_id']);
    console.log('==========================');

    // Only return store_id, no fallback
    return decoded['custom:store_id'] || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function getCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
}

export function storeAuthData(tokens: TokenResponse, storeId: string) {
  localStorage.setItem('id_token', tokens.id_token);
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('store_id', storeId);
}

export function getStoredStoreId(): string | null {
  return localStorage.getItem('store_id');
}

export function clearAuthData() {
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('store_id');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('id_token');
}

export function getUserEmail(): string | null {
  const idToken = localStorage.getItem('id_token');
  if (!idToken) return null;

  try {
    const decoded = decodeJWT(idToken);
    return decoded.email || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
