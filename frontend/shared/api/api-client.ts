import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authTokenStorage } from "@/shared/lib/auth-token-storage";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = authTokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const refreshToken = authTokenStorage.getRefreshToken();

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      !refreshToken ||
      originalRequest.url === "/refresh"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${API_BASE_URL}/refresh`,
        { refreshToken },
      );

      authTokenStorage.setAccessToken(data.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      authTokenStorage.clear();
      return Promise.reject(refreshError);
    }
  },
);
