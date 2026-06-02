import { CreateUserSchema } from "@src/application/user/use-cases/create-user/create-user.req.dto";

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
};
