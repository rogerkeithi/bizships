const ACCESS_TOKEN_KEY = "bizships-access-token";
const REFRESH_TOKEN_KEY = "bizships-refresh-token";
const USER_KEY = "bizships-user";
const AUTH_COOKIE = "bizships-authenticated";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  email: string;
  name: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  birthDate?: string;
  phone?: string;
  avatarUrl?: string;
  isConfirmed?: boolean;
}

const canUseStorage = () => typeof window !== "undefined";
const cookieOptions = "path=/; SameSite=Lax; max-age=604800";

export const authTokenStorage = {
  getAccessToken() {
    if (!canUseStorage()) {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    if (!canUseStorage()) {
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser() {
    if (!canUseStorage()) {
      return null;
    }

    const user = window.localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  },

  setTokens(tokens: AuthTokens, user?: AuthUser) {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    document.cookie = `${AUTH_COOKIE}=true; ${cookieOptions}`;

    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  setAccessToken(accessToken: string) {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  setUser(user: AuthUser) {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  },
};
