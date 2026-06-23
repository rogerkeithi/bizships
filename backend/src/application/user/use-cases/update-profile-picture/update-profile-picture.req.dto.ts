import { z } from "zod/v4";

export const UpdateProfilePictureSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export interface UpdateProfilePictureReq {
  userId: string;
  imageBase64: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}
