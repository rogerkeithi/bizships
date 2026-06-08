import { User } from "../entities/User";

export interface IUserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(userId: string): Promise<User | undefined>;
}
