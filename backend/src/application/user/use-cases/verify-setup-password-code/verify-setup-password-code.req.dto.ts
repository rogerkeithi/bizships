import { z } from "zod";

export const VerifySetupPasswordCodeSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),
  code: z.string().length(6),
});

export type VerifySetupPasswordCodeReq = z.infer<
  typeof VerifySetupPasswordCodeSchema
>;
