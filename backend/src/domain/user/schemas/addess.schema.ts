import { z } from "zod";

const requiredString = (field: string) =>
  z.string().trim().min(1, `${field} is required`);

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().trim().min(1).optional());

export const addressSchema = z.object({
  country: z.string().length(2).meta({
    description: "ISO country code",
    example: "BR",
  }),

  postalCode: requiredString("Postal code").meta({
    description: "Postal code",
    example: "11660000",
  }),

  city: requiredString("City").meta({
    description: "City",
    example: "Caraguatatuba",
  }),

  street: requiredString("Street").meta({
    description: "Street",
    example: "Avenida Brasil",
  }),

  number: requiredString("Number").meta({
    description: "Address number",
    example: "123",
  }),

  state: optionalString.meta({
    description: "State or province",
    example: "SP",
  }),

  district: optionalString.meta({
    description: "District or neighborhood",
    example: "Centro",
  }),

  complement: optionalString.meta({
    description: "Address complement",
    example: "Apartment 42",
  }),
});

export type AddressReq = z.infer<typeof addressSchema>;
