import { addressSchema } from "@src/domain/user/schemas/addess.schema";
import { birthDateSchema } from "@src/domain/user/schemas/birthDate.schema";
import { phoneSchema } from "@src/domain/user/schemas/phone.schema";
import { z } from "zod";

export const FinishRegistrationSchema = z.object({
  email: z.email().meta({
    description: "User email",
    example: "user@email.com",
  }),

  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  socialName: z.string().trim().min(2).optional(),

  phone: phoneSchema.meta({
    description: "User phone number with international country code",
    example: "+5512999999999",
  }),

  birthDate: birthDateSchema.meta({
    description: "User birth date",
    example: "1998-04-15",
  }),

  address: addressSchema,
});

export type FinishRegistrationReq = z.infer<typeof FinishRegistrationSchema>;
