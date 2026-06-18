import { AxiosError } from "axios";

import { apiClient } from "@/shared/api/api-client";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  code: string;
}

export interface UserByEmail {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  phone?: string;
  status: boolean;
  isConfirmed: boolean;
}

export const getApiErrorCode = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    return null;
  }

  return (error.response?.data as ApiErrorBody | undefined)?.code ?? null;
};

export const registrationService = {
  async findUserByEmail(email: string) {
    const { data } = await apiClient.get<ApiResponse<UserByEmail>>(
      "/users/by-email",
      {
        params: { email },
      },
    );

    return data.data;
  },

  async createUser(email: string) {
    await apiClient.post("/users", {
      email,
      country: "BR",
    });
  },

  async resendConfirmEmail(email: string) {
    await apiClient.post("/users/resend-confirm", { email });
  },

  async confirmEmail(tokenId: string) {
    const { data } = await apiClient.post<
      ApiResponse<{ setupPasswordToken: string }>
    >("/users/confirm-user", { tokenId });

    return data.data;
  },

  async verifySetupPasswordToken(setupPasswordToken: string) {
    const { data } = await apiClient.post<ApiResponse<{ valid: boolean }>>(
      "/users/verify-setup-password-token",
      { setupPasswordToken },
    );

    return data.data;
  },

  async sendSetupPasswordCode(email: string) {
    await apiClient.post("/users/send-setup-password-code", { email });
  },

  async verifySetupPasswordCode(email: string, code: string) {
    const { data } = await apiClient.post<
      ApiResponse<{ setupPasswordToken: string }>
    >("/users/verify-setup-password-code", { email, code });

    return data.data;
  },

  async setupPassword(setupPasswordToken: string, password: string) {
    await apiClient.post("/users/setup-password", {
      setupPasswordToken,
      password,
    });
  },
};
