import { z } from "zod";

export const VerifySetupPasswordCodeSchema = z.object({
  code: z.string().length(6),
});

export type VerifySetupPasswordCodeReq = z.infer<
  typeof VerifySetupPasswordCodeSchema
>;
