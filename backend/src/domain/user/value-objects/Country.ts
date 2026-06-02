import { InvalidCountryError } from "@src/shared/errors/user-errors";

export class Country {
  private readonly value: string;

  constructor(countryCode: string) {
    if (!this.isValid(countryCode)) {
      throw new InvalidCountryError();
    }

    this.value = countryCode.toUpperCase();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other?: Country): boolean {
    return !!other && this.value === other.value;
  }

  private isValid(countryCode: string): boolean {
    return /^[A-Z]{2}$/.test(countryCode);
  }
}
