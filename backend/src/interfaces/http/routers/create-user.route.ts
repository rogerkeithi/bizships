import { container } from "@src/di/container";
import express from "express";
import CreateUserController from "../controllers/create-user.controller";
import { asyncHandler } from "@src/shared/utils/async-handler";

const userRoute = express.Router();

const createUserController =
  container.get<CreateUserController>(CreateUserController);

userRoute.post(
  "/users",
  asyncHandler(createUserController.execute.bind(createUserController)),
);

export default userRoute;
