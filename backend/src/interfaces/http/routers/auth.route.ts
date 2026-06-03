import { container } from "@src/di/container";
import express from "express";
import { asyncHandler } from "@src/shared/utils/async-handler";
import LoginController from "../controllers/auth/login.controller";

const authRoute = express.Router();

const controllers = {
  login: container.get(LoginController),
};

authRoute.post(
  "/login",
  asyncHandler(controllers.login.execute.bind(controllers.login)),
);

export default authRoute;
