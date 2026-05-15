import { Options } from "swagger-jsdoc";

const isDev = process.env.NODE_ENV === "development";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: `Bizships`,
      version: "1.0.0",
      description: "Backend",
    },
    servers: [
      {
        url: "/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [isDev ? "./src/routes/*.ts" : "./dist/routes/*.js"],
};

export default swaggerOptions;
