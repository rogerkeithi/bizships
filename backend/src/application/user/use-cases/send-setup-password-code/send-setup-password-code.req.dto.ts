import { z } from "zod";

export const SendSetupPasswordCodeSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),
});

export type SendSetupPasswordCodeReq = z.infer<
  typeof SendSetupPasswordCodeSchema
>;
