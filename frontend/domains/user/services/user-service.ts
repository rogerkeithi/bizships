import { apiClient } from "@/shared/api/api-client";
import {
  authTokenStorage,
  type AuthUser,
} from "@/shared/lib/auth-token-storage";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  birthDate?: string;
  phone?: string;
  status: boolean;
  isConfirmed: boolean;
}

export interface FinishRegistrationPayload {
  email: string;
  firstName: string;
  lastName: string;
  socialName?: string;
  phone: string;
  birthDate: string;
  address: {
    country: string;
    postalCode: string;
    city: string;
    street: string;
    number: string;
    state?: string;
    district?: string;
    complement?: string;
  };
}

const fallbackNameFromEmail = (email: string) => email.split("@")[0] || email;

export const isProfileComplete = (
  user?: Pick<AuthUser, "firstName" | "lastName" | "birthDate"> | null,
) => Boolean(user?.firstName && user.lastName && user.birthDate);

export const toAuthUser = (profile: UserProfile): AuthUser => {
  const preferredName =
    profile.socialName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
    fallbackNameFromEmail(profile.email);

  return {
    userId: profile.userId,
    email: profile.email,
    name: preferredName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    socialName: profile.socialName,
    birthDate: profile.birthDate,
    phone: profile.phone,
    isConfirmed: profile.isConfirmed,
  };
};

export const userService = {
  async findByEmail(email: string) {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>(
      "/users/by-email",
      {
        params: { email },
      },
    );

    return data.data;
  },

  async syncAuthUser(email: string) {
    const profile = await this.findByEmail(email);
    const authUser = toAuthUser(profile);
    authTokenStorage.setUser(authUser);

    return authUser;
  },

  async finishRegistration(payload: FinishRegistrationPayload) {
    await apiClient.post("/users/finish-registration", payload);
  },
};
