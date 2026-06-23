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
import { ICodeRepository } from "@src/domain/code/repositories/code-repository.interface";
import { CodeRepository } from "@src/infra/database/mongo/repositories/code-repository";
import { ResendConfirmUserUseCase } from "@src/application/user/use-cases/resend-confirm-user/resend-confirm-user";
import { VerifySetupPasswordCodeUseCase } from "@src/application/user/use-cases/verify-setup-password-code/verify-setup-password-code";
import { SendSetupPasswordCodeUseCase } from "@src/application/user/use-cases/send-setup-password-code/send-setup-password-code";
import ResendConfirmUserController from "@src/interfaces/http/controllers/user/resend-confirm-user.controller";
import VerifySetupPasswordCodeController from "@src/interfaces/http/controllers/user/verify-setup-password-code.controller";
import SendSetupPasswordCodeController from "@src/interfaces/http/controllers/user/send-setup-password-code.controller";
import { FinishRegistrationUseCase } from "@src/application/user/use-cases/finish-registration/finish-registration";
import { VerifySetupPasswordTokenUseCase } from "@src/application/user/use-cases/verify-setup-password-token/verify-setup-password-token";
import FinishRegistrationController from "@src/interfaces/http/controllers/user/finish-registration.controller";
import VerifySetupPasswordTokenController from "@src/interfaces/http/controllers/user/verify-setup-password-token.controller";
import { UpdateProfilePictureUseCase } from "@src/application/user/use-cases/update-profile-picture/update-profile-picture";
import UpdateProfilePictureController from "@src/interfaces/http/controllers/user/update-profile-picture.controller";

export function registerUserModule(container: Container) {
  //Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
  container
    .bind<IConfirmUserTokenRepository>(TYPES.IConfirmUserTokenRepository)
    .to(ConfirmUserTokenRepository);
  container.bind<ICodeRepository>(TYPES.ICodeRepository).to(CodeRepository);

  //Use Cases
  container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
  container.bind<FindUserByEmailUseCase>(FindUserByEmailUseCase).toSelf();
  container.bind<ConfirmUserUseCase>(ConfirmUserUseCase).toSelf();
  container.bind<SetupPasswordUseCase>(SetupPasswordUseCase).toSelf();
  container.bind<ResendConfirmUserUseCase>(ResendConfirmUserUseCase).toSelf();
  container
    .bind<VerifySetupPasswordCodeUseCase>(VerifySetupPasswordCodeUseCase)
    .toSelf();
  container
    .bind<SendSetupPasswordCodeUseCase>(SendSetupPasswordCodeUseCase)
    .toSelf();
  container.bind<FinishRegistrationUseCase>(FinishRegistrationUseCase).toSelf();
  container
    .bind<VerifySetupPasswordTokenUseCase>(VerifySetupPasswordTokenUseCase)
    .toSelf();
  container
    .bind<UpdateProfilePictureUseCase>(UpdateProfilePictureUseCase)
    .toSelf();

  //Controllers
  container.bind<CreateUserController>(CreateUserController).toSelf();
  container.bind<FindUserByEmailController>(FindUserByEmailController).toSelf();
  container.bind<ConfirmUserController>(ConfirmUserController).toSelf();
  container.bind<SetupPasswordController>(SetupPasswordController).toSelf();
  container
    .bind<ResendConfirmUserController>(ResendConfirmUserController)
    .toSelf();
  container
    .bind<VerifySetupPasswordCodeController>(VerifySetupPasswordCodeController)
    .toSelf();
  container
    .bind<SendSetupPasswordCodeController>(SendSetupPasswordCodeController)
    .toSelf();
  container
    .bind<FinishRegistrationController>(FinishRegistrationController)
    .toSelf();
  container
    .bind<VerifySetupPasswordTokenController>(
      VerifySetupPasswordTokenController,
    )
    .toSelf();
  container
    .bind<UpdateProfilePictureController>(UpdateProfilePictureController)
    .toSelf();
}
