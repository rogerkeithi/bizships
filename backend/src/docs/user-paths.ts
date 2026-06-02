import { CreateUserSchema } from "@src/application/user/use-cases/create-user/create-user.req.dto";
import { FindUserByEmailSchema } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email.req.dto";

export const userPaths = {
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
};
