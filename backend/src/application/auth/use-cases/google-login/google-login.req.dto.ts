import { z } from "zod";

export const GoogleLoginSchema = z.object({
  credential: z.string().min(1).meta({
    description: "Google Identity Services ID token",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  }),
});

export type GoogleLoginReq = z.infer<typeof GoogleLoginSchema>;
