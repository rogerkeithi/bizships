import { Container } from "inversify";
import { TYPES } from "../types";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { RefreshTokenRepository } from "@src/infra/database/mongo/repositories/refresh-token-repository";
import { LoginUseCase } from "@src/application/auth/use-cases/login/login";
import LoginController from "@src/interfaces/http/controllers/auth/login.controller";

export function registerAuthModule(container: Container) {
  //Repositories
  container
    .bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository)
    .to(RefreshTokenRepository);

  //Use Cases
  container.bind<LoginUseCase>(LoginUseCase).toSelf();

  //Controllers
  container.bind<LoginController>(LoginController).toSelf();
}
