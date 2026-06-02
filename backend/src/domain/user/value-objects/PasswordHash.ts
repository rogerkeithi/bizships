import { InvalidPasswordHashError } from "@src/shared/errors/user-errors";

export class PasswordHash {
  private readonly value: string;

  constructor(hash: string) {
    if (!this.isValidArgon2Hash(hash)) {
      throw new InvalidPasswordHashError();
    }

    this.value = hash;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other?: PasswordHash): boolean {
    return !!other && this.value === other.value;
  }

  private isValidArgon2Hash(hash: string): boolean {
    return hash.startsWith("$argon2");
  }
}
