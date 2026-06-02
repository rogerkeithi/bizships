import { Container } from "inversify";
import { TYPES } from "../types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserRepository } from "@src/infra/database/mongo/repositories/user-repository";
import { CreateUserUseCase } from "@src/application/user/use-cases/create-user/create-user";
import CreateUserController from "@src/interfaces/http/controllers/create-user.controller";
import { Argon2PasswordHasher } from "@src/services/password-hasher/password-hasher";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";
import { FindUserByEmailUseCase } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email";
import FindUserByEmailController from "@src/interfaces/http/controllers/find-user-by-email.controller";

export function registerUserModule(container: Container) {
  //Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

  //Use Cases
  container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
  container.bind<FindUserByEmailUseCase>(FindUserByEmailUseCase).toSelf();

  //Controllers
  container.bind<CreateUserController>(CreateUserController).toSelf();
  container.bind<FindUserByEmailController>(FindUserByEmailController).toSelf();
}
