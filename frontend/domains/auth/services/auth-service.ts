import { apiClient } from "@/shared/api/api-client";
import {
  authTokenStorage,
  type AuthTokens,
} from "@/shared/lib/auth-token-storage";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface GoogleLoginPayload {
  credential: string;
  email: string;
}

export interface GoogleLoginResponse extends AuthTokens {
  setupPasswordToken?: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>(
      "/login",
      payload,
    );
    const tokens = data.data;
    const userName = payload.email.split("@")[0] || payload.email;

    authTokenStorage.setTokens(tokens, {
      email: payload.email,
      name: userName,
    });

    return tokens;
  },

  async googleLogin(payload: GoogleLoginPayload) {
    const { data } = await apiClient.post<ApiResponse<GoogleLoginResponse>>(
      "/auth/google",
      { credential: payload.credential },
    );
    const tokens = data.data;
    const userName = payload.email.split("@")[0] || payload.email;

    authTokenStorage.setTokens(tokens, {
      email: payload.email,
      name: userName,
    });

    return tokens;
  },

  async refresh(payload: RefreshPayload) {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      "/refresh",
      payload,
    );
    authTokenStorage.setAccessToken(data.data.accessToken);
    return data.data;
  },

  async logout() {
    const refreshToken = authTokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await apiClient.post("/logout", { refreshToken });
      }
    } finally {
      authTokenStorage.clear();
    }
  },
};
