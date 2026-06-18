import { container } from "@src/di/container";
import express from "express";
import { asyncHandler } from "@src/shared/utils/async-handler";
import CreateUserController from "../controllers/user/create-user.controller";
import FindUserByEmailController from "../controllers/user/find-user-by-email.controller";
import SetupPasswordController from "../controllers/user/setup-password.controller";
import ConfirmUserController from "../controllers/user/confirm-user.controller";
import ResendConfirmUserController from "../controllers/user/resend-confirm-user.controller";
import VerifySetupPasswordCodeController from "../controllers/user/verify-setup-password-code.controller";
import SendSetupPasswordCodeController from "../controllers/user/send-setup-password-code.controller";
import VerifySetupPasswordTokenController from "../controllers/user/verify-setup-password-token.controller";
import FinishRegistrationController from "../controllers/user/finish-registration.controller";

const userRoute = express.Router();

const controllers = {
  create: container.get(CreateUserController),
  findByEmail: container.get(FindUserByEmailController),
  confirmUser: container.get(ConfirmUserController),
  finishRegistration: container.get(FinishRegistrationController),
  setupPassword: container.get(SetupPasswordController),
  resendConfirmUser: container.get(ResendConfirmUserController),
  verifySetupPasswordToken: container.get(VerifySetupPasswordTokenController),
  verifySetupPasswordCode: container.get(VerifySetupPasswordCodeController),
  sendSetupPasswordCode: container.get(SendSetupPasswordCodeController),
};

userRoute.post(
  "/users",
  asyncHandler(controllers.create.execute.bind(controllers.create)),
);
userRoute.get(
  "/users/by-email",
  asyncHandler(controllers.findByEmail.execute.bind(controllers.findByEmail)),
);
userRoute.post(
  "/users/confirm-user",
  asyncHandler(controllers.confirmUser.execute.bind(controllers.confirmUser)),
);
userRoute.post(
  "/users/finish-registration",
  asyncHandler(
    controllers.finishRegistration.execute.bind(controllers.finishRegistration),
  ),
);
userRoute.post(
  "/users/setup-password",
  asyncHandler(
    controllers.setupPassword.execute.bind(controllers.setupPassword),
  ),
);
userRoute.post(
  "/users/resend-confirm",
  asyncHandler(
    controllers.resendConfirmUser.execute.bind(controllers.resendConfirmUser),
  ),
);
userRoute.post(
  "/users/verify-setup-password-token",
  asyncHandler(
    controllers.verifySetupPasswordToken.execute.bind(
      controllers.verifySetupPasswordToken,
    ),
  ),
);
userRoute.post(
  "/users/verify-setup-password-code",
  asyncHandler(
    controllers.verifySetupPasswordCode.execute.bind(
      controllers.verifySetupPasswordCode,
    ),
  ),
);
userRoute.post(
  "/users/send-setup-password-code",
  asyncHandler(
    controllers.sendSetupPasswordCode.execute.bind(
      controllers.sendSetupPasswordCode,
    ),
  ),
);
export default userRoute;
