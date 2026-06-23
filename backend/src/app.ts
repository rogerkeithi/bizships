import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler } from "./shared/middlewares/error-handler";
import { openApiDocument } from "./docs/open-api";
import userRoute from "./interfaces/http/routers/user.route";
import authRoute from "./interfaces/http/routers/auth.route";

const app = express();
const uploadsDir = process.env.UPLOADS_DIR ?? path.resolve("uploads");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/uploads", express.static(uploadsDir));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use(userRoute);
app.use(authRoute);

app.use(errorHandler);

export default app;
