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
const REDIRECT_URI = 'https://admin-lp.global-reaches.com';

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

// ============================================================
// API呼び出し用のトークン管理
// IDトークンの有効期限は30分のため、期限切れ前にリフレッシュトークンで更新する
// ============================================================

const TOKEN_REFRESH_MARGIN_SEC = 120;
let refreshPromise: Promise<string | null> | null = null;

function isTokenFresh(idToken: string): boolean {
  try {
    const { exp } = decodeJWT(idToken);
    return typeof exp === 'number' && exp - Date.now() / 1000 > TOKEN_REFRESH_MARGIN_SEC;
  } catch {
    return false;
  }
}

async function refreshIdToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!response.ok) {
      console.warn('Token refresh failed:', response.status);
      return null;
    }
    const tokens: Partial<TokenResponse> = await response.json();
    if (!tokens.id_token) return null;
    localStorage.setItem('id_token', tokens.id_token);
    if (tokens.access_token) localStorage.setItem('access_token', tokens.access_token);
    return tokens.id_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * 有効なIDトークンを返す（期限切れ間近ならリフレッシュする）
 */
export async function getValidIdToken(forceRefresh = false): Promise<string | null> {
  const idToken = localStorage.getItem('id_token');
  if (!forceRefresh && idToken && isTokenFresh(idToken)) return idToken;

  if (!refreshPromise) {
    refreshPromise = refreshIdToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin() {
  clearAuthData();
  window.location.href = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
}

/**
 * Authorizationヘッダー（Cognito IDトークン）を付けて fetch する。
 * 401 の場合はトークンを更新して1回だけ再試行し、それでも 401 ならログイン画面へ戻す。
 */
export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const withToken = (token: string | null): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let response = await fetch(url, withToken(await getValidIdToken()));
  if (response.status !== 401) return response;

  const refreshed = await getValidIdToken(true);
  if (refreshed) {
    response = await fetch(url, withToken(refreshed));
    if (response.status !== 401) return response;
  }

  alert('ログインの有効期限が切れました。再度ログインしてください。');
  redirectToLogin();
  return response;
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
