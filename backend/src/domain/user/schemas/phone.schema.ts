import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const phoneSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (!value.startsWith("+")) {
      ctx.addIssue({
        code: "custom",
        message: "Phone must include international country code",
      });

      return z.NEVER;
    }

    const parsed = parsePhoneNumberFromString(value);

    if (!parsed?.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid phone number",
      });

      return z.NEVER;
    }

    return parsed.number;
  });
