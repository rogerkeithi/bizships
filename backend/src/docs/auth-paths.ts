import { LoginSchema } from "@src/application/auth/use-cases/login/login.req.dto";
import { LogoutSchema } from "@src/application/auth/use-cases/logout/logout.req.dto";
import { RefreshSchema } from "@src/application/auth/use-cases/refresh/refresh.req.dto";
import { ZodOpenApiPathsObject } from "zod-openapi";

export const authPaths: ZodOpenApiPathsObject = {
  "/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: LoginSchema,
          },
        },
      },

      responses: {
        "201": {
          description: "User logged",
        },

        "400": {
          description: "Validation error",
        },

        "403": {
          description: "Wrong credentials",
        },
      },
    },
  },

  "/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: LogoutSchema,
          },
        },
      },

      responses: {
        "200": {
          description: "User logged out",
        },

        "400": {
          description: "Validation error",
        },

        "403": {
          description: "Logout error",
        },
      },
    },
  },

  "/refresh": {
    post: {
      tags: ["Auth"],
      summary: "Refresh",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: RefreshSchema,
          },
        },
      },

      responses: {
        "200": {
          description: "Token refreshed",
        },

        "400": {
          description: "Validation error",
        },

        "403": {
          description: "User cant refresh",
        },
      },
    },
  },
};
