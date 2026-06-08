import { z } from "zod";

export const ResendConfirmUserSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),
});

export type ResendConfirmUserReq = z.infer<typeof ResendConfirmUserSchema>;
