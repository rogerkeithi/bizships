import { z } from "zod";

export const LogoutSchema = z.object({
  refreshToken: z.string().min(10),
});

export type LogoutReq = z.infer<typeof LogoutSchema>;
