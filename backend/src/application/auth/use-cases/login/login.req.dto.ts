import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),

  password: z.string().min(8, "Password must be at least 8 characters").meta({
    description: "User password",
    example: "********",
  }),
});

export type LoginReq = z.infer<typeof LoginSchema>;
