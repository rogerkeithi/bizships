export interface FindUserByEmailRes {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  birthDate?: Date;
  phone?: string;
  phoneVerifiedAt?: Date;
  avatarUrl?: string;
  status: boolean;
  isConfirmed: boolean;
}
