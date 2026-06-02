import { inject, injectable } from "inversify";
import { CreateUserReq } from "./create-user.req.dto";
import { randomUUID } from "crypto";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { Country } from "@src/domain/user/value-objects/Country";
import { Email } from "@src/domain/user/value-objects/Email";
import { User } from "@src/domain/user/entities/User";
import { UserAlreadyExistsError } from "@src/shared/errors/user-errors";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(data: CreateUserReq): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const userId = randomUUID();
    const email = new Email(data.email);
    const country = new Country(data.country);

    const user = User.create({ userId, email, country });

    await this.userRepository.create(user);
  }
}
