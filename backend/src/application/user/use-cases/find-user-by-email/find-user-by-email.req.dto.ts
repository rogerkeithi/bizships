import { z } from "zod";

export const FindUserByEmailSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),
});

export type FindUserByEmailReq = z.infer<typeof FindUserByEmailSchema>;
