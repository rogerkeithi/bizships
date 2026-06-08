import { Container } from "inversify";
import { TYPES } from "../types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserRepository } from "@src/infra/database/mongo/repositories/user-repository";
import { CreateUserUseCase } from "@src/application/user/use-cases/create-user/create-user";
import CreateUserController from "@src/interfaces/http/controllers/user/create-user.controller";
import { FindUserByEmailUseCase } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email";
import FindUserByEmailController from "@src/interfaces/http/controllers/user/find-user-by-email.controller";
import { IConfirmUserTokenRepository } from "@src/domain/token/repositories/confirm-user-token-repository.interface";
import { ConfirmUserTokenRepository } from "@src/infra/database/mongo/repositories/confirm-user-token-repository";
import { ConfirmUserUseCase } from "@src/application/user/use-cases/confirm-user/confirm-user";
import { SetupPasswordUseCase } from "@src/application/user/use-cases/setup-password/setup-password";
import ConfirmUserController from "@src/interfaces/http/controllers/user/confirm-user.controller";
import SetupPasswordController from "@src/interfaces/http/controllers/user/setup-password.controller";

export function registerUserModule(container: Container) {
  //Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
  container
    .bind<IConfirmUserTokenRepository>(TYPES.IConfirmUserTokenRepository)
    .to(ConfirmUserTokenRepository);

  //Use Cases
  container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
  container.bind<FindUserByEmailUseCase>(FindUserByEmailUseCase).toSelf();
  container.bind<ConfirmUserUseCase>(ConfirmUserUseCase).toSelf();
  container.bind<SetupPasswordUseCase>(SetupPasswordUseCase).toSelf();

  //Controllers
  container.bind<CreateUserController>(CreateUserController).toSelf();
  container.bind<FindUserByEmailController>(FindUserByEmailController).toSelf();
  container.bind<ConfirmUserController>(ConfirmUserController).toSelf();
  container.bind<SetupPasswordController>(SetupPasswordController).toSelf();
}
