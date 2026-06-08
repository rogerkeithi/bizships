import { ConfirmUserSchema } from "@src/application/user/use-cases/confirm-user/confirm-user.req.dto";
import { CreateUserSchema } from "@src/application/user/use-cases/create-user/create-user.req.dto";
import { FindUserByEmailSchema } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email.req.dto";
import { SetupPasswordSchema } from "@src/application/user/use-cases/setup-password/setup-password.req.dto";
import { ZodOpenApiPathsObject } from "zod-openapi";

export const userPaths: ZodOpenApiPathsObject = {
  "/users": {
    post: {
      tags: ["Users"],
      summary: "Create user",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },

      responses: {
        "201": {
          description: "User created",
        },

        "400": {
          description: "Validation error",
        },

        "409": {
          description: "User already exists",
        },
      },
    },
  },

  "/users/by-email": {
    get: {
      tags: ["Users"],
      summary: "Find user by email",

      requestParams: {
        query: FindUserByEmailSchema,
      },

      responses: {
        "200": {
          description: "User found",
        },
        "400": {
          description: "Validation error",
        },
        "404": {
          description: "User not found",
        },
      },
    },
  },

  "/users/confirm-user": {
    post: {
      tags: ["Users"],
      summary: "Confirm user",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ConfirmUserSchema,
          },
        },
      },

      responses: {
        "200": {
          description: "User confirmed",
        },

        "400": {
          description: "Validation error",
        },

        "403": {
          description: "User already confirmed",
        },
      },
    },
  },

  "/setup-password": {
    post: {
      tags: ["Users"],
      summary: "Setup password",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: SetupPasswordSchema,
          },
        },
      },

      responses: {
        "200": {
          description: "Password setted",
        },

        "400": {
          description: "Validation error",
        },

        "403": {
          description: "User already confirmed",
        },
      },
    },
  },
};
