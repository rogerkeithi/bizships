export interface FindUserByEmailRes {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  phone?: string;
  status: boolean;
  isConfirmed: boolean;
}
