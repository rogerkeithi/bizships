import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/middlewares/error-handler";
import { openApiDocument } from "./docs/open-api";
import userRoute from "./interfaces/http/routers/user.route";
import authRoute from "./interfaces/http/routers/auth.route";

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(errorHandler);

app.use(userRoute);
app.use(authRoute);

export default app;
