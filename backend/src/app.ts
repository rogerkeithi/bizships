import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/middlewares/error-handler";
import { openApiDocument } from "./docs/open-api";
import userRoute from "./interfaces/http/routers/user.route";

const app = express();

console.log(JSON.stringify(openApiDocument.paths, null, 2));

console.log(
  JSON.stringify(openApiDocument.paths?.["/users/by-email"], null, 2),
);

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

export default app;
