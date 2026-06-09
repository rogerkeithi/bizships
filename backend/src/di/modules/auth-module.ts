import { Container } from "inversify";
import { TYPES } from "../types";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { RefreshTokenRepository } from "@src/infra/database/mongo/repositories/refresh-token-repository";
import { LoginUseCase } from "@src/application/auth/use-cases/login/login";
import LoginController from "@src/interfaces/http/controllers/auth/login.controller";
import { JwtService } from "@src/services/jwt/jwt.service";
import { LogoutUseCase } from "@src/application/auth/use-cases/logout/logout";
import { RefreshUseCase } from "@src/application/auth/use-cases/refresh/refresh";
import LogoutController from "@src/interfaces/http/controllers/auth/logout.controller";
import RefreshController from "@src/interfaces/http/controllers/auth/refresh.controller";

export function registerAuthModule(container: Container) {
  //Repositories
  container
    .bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository)
    .to(RefreshTokenRepository);

  //Service
  container.bind(JwtService).toSelf();

  //Use Cases
  container.bind<LoginUseCase>(LoginUseCase).toSelf();
  container.bind<LogoutUseCase>(LogoutUseCase).toSelf();
  container.bind<RefreshUseCase>(RefreshUseCase).toSelf();

  //Controllers
  container.bind<LoginController>(LoginController).toSelf();
  container.bind<LogoutController>(LogoutController).toSelf();
  container.bind<RefreshController>(RefreshController).toSelf();
}
