import { apiClient } from "@/shared/api/api-client";
import {
  authTokenStorage,
  type AuthTokens,
} from "@/shared/lib/auth-token-storage";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthTokens>("/login", payload);
    authTokenStorage.setTokens(data);
    return data;
  },

  async refresh(payload: RefreshPayload) {
    const { data } = await apiClient.post<{ accessToken: string }>(
      "/refresh",
      payload,
    );
    authTokenStorage.setAccessToken(data.accessToken);
    return data;
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
