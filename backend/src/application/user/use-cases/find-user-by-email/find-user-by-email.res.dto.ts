export interface FindUserByEmailRes {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  birthDate?: Date;
  phone?: string;
  phoneVerifiedAt?: Date;
  status: boolean;
  isConfirmed: boolean;
}
