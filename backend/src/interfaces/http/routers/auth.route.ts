import { container } from "@src/di/container";
import express from "express";
import { asyncHandler } from "@src/shared/utils/async-handler";
import LoginController from "../controllers/auth/login.controller";
import LogoutController from "../controllers/auth/logout.controller";
import RefreshController from "../controllers/auth/refresh.controller";
import GoogleLoginController from "../controllers/auth/google-login.controller";

const authRoute = express.Router();

const controllers = {
  login: container.get(LoginController),
  googleLogin: container.get(GoogleLoginController),
  logout: container.get(LogoutController),
  refresh: container.get(RefreshController),
};

authRoute.post(
  "/login",
  asyncHandler(controllers.login.execute.bind(controllers.login)),
);
authRoute.post(
  "/auth/google",
  asyncHandler(controllers.googleLogin.execute.bind(controllers.googleLogin)),
);
authRoute.post(
  "/logout",
  asyncHandler(controllers.logout.execute.bind(controllers.logout)),
);
authRoute.post(
  "/refresh",
  asyncHandler(controllers.refresh.execute.bind(controllers.refresh)),
);

export default authRoute;
