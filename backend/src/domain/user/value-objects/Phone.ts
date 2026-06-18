import { InvalidPhoneError } from "@src/shared/errors/user-errors";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    const normalizedPhone = this.normalize(phone);

    if (!normalizedPhone) {
      throw new InvalidPhoneError();
    }

    this.value = normalizedPhone;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other?: Phone): boolean {
    return !!other && this.value === other.value;
  }

  private normalize(phone: string): string | null {
    const normalized = phone.trim();

    if (!normalized.startsWith("+")) {
      return null;
    }

    const parsed = parsePhoneNumberFromString(normalized);

    if (!parsed?.isValid()) {
      return null;
    }

    return parsed.number;
  }
}
