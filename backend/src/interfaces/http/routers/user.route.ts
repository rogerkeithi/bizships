import { container } from "@src/di/container";
import express from "express";
import { asyncHandler } from "@src/shared/utils/async-handler";
import CreateUserController from "../controllers/user/create-user.controller";
import FindUserByEmailController from "../controllers/user/find-user-by-email.controller";

const userRoute = express.Router();

const controllers = {
  create: container.get(CreateUserController),
  findByEmail: container.get(FindUserByEmailController),
};

userRoute.post(
  "/users",
  asyncHandler(controllers.create.execute.bind(controllers.create)),
);
userRoute.get(
  "/users/by-email",
  asyncHandler(controllers.findByEmail.execute.bind(controllers.findByEmail)),
);

export default userRoute;
