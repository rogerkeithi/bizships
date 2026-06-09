import { container } from "@src/di/container";
import express from "express";
import { asyncHandler } from "@src/shared/utils/async-handler";
import CreateUserController from "../controllers/user/create-user.controller";
import FindUserByEmailController from "../controllers/user/find-user-by-email.controller";
import SetupPasswordController from "../controllers/user/setup-password.controller";
import ConfirmUserController from "../controllers/user/confirm-user.controller";

const userRoute = express.Router();

const controllers = {
  create: container.get(CreateUserController),
  findByEmail: container.get(FindUserByEmailController),
  confirmUser: container.get(ConfirmUserController),
  setupPassword: container.get(SetupPasswordController),
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
  "/users/setup-password",
  asyncHandler(
    controllers.setupPassword.execute.bind(controllers.setupPassword),
  ),
);
export default userRoute;
