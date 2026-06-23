import { User } from "../entities/User";

export interface IUserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findByGoogleId(googleId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(userId: string): Promise<User | undefined>;
}
