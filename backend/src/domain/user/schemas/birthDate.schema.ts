import { z } from "zod";

export const birthDateSchema = z.iso
  .date()
  .refine(
    (value) => {
      const birthDate = new Date(`${value}T00:00:00.000Z`);
      const now = new Date();

      return birthDate < now;
    },
    {
      message: "Birth date must be in the past",
    },
  )
  .refine(
    (value) => {
      const birthDate = new Date(`${value}T00:00:00.000Z`);
      const now = new Date();

      const age = now.getUTCFullYear() - birthDate.getUTCFullYear();

      const hasHadBirthdayThisYear =
        now.getUTCMonth() > birthDate.getUTCMonth() ||
        (now.getUTCMonth() === birthDate.getUTCMonth() &&
          now.getUTCDate() >= birthDate.getUTCDate());

      const realAge = hasHadBirthdayThisYear ? age : age - 1;

      return realAge >= 13;
    },
    {
      message: "User must be at least 13 years old",
    },
  );
