import { z } from "zod";

export const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export type RefreshReq = z.infer<typeof RefreshSchema>;
