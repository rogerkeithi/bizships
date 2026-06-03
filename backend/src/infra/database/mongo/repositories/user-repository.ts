import { User } from "@src/domain/user/entities/User";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserModel } from "../models/user-model";
import { UserPersistenceMapper } from "../mappers/user-persistence-mapper";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  async create(user: User): Promise<void> {
    await UserModel.create(UserPersistenceMapper.toPersistence(user));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({
      email,
    }).lean();

    if (!user) {
      return undefined;
    }

    return UserPersistenceMapper.toDomain(user);
  }
}
