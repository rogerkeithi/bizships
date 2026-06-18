import { z } from "zod";

export const VerifySetupPasswordTokenSchema = z.object({
  setupPasswordToken: z.string(),
});

export type VerifySetupPasswordTokenReq = z.infer<
  typeof VerifySetupPasswordTokenSchema
>;
