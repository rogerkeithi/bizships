import { z } from "zod";

export const ConfirmUserSchema = z.object({
  tokenId: z.uuid().meta({
    description: "Email confirmation token ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
});

export type ConfirmUserReq = z.infer<typeof ConfirmUserSchema>;
