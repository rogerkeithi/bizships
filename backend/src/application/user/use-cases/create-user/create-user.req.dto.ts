import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),

  country: z.string().length(2).meta({
    description: "ISO country code",
    example: "BR",
  }),
});

export type CreateUserReq = z.infer<typeof CreateUserSchema>;
