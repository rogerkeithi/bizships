import { Container } from "inversify";
import { TYPES } from "../types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserRepository } from "@src/infra/database/mongo/repositories/user-repository";
import { CreateUserUseCase } from "@src/application/user/use-cases/create-user/create-user";
import CreateUserController from "@src/interfaces/http/controllers/create-user.controller";
import { Argon2PasswordHasher } from "@src/services/password-hasher/password-hasher";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";

export function registerUserModule(container: Container) {
  //Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

  //Use Cases
  container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();

  //Controllers
  container.bind<CreateUserController>(CreateUserController).toSelf();

  //Services
  container
    .bind<IPasswordHasher>(TYPES.IPasswordHasher)
    .to(Argon2PasswordHasher);
}
