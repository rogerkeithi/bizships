import { createDocument } from "zod-openapi";
import { userPaths } from "./user-paths";

export const openApiDocument = createDocument({
  openapi: "3.1.0",

  info: {
    title: "Bizships",
    version: "1.0.0",
  },

  paths: {
    ...userPaths,
  },
});
