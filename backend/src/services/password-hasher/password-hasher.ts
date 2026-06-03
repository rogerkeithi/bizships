import argon2 from "argon2";
import { IPasswordHasher } from "./password-hasher.interface";
import { PasswordHash } from "@src/domain/user/value-objects/PasswordHash";
import { injectable } from "inversify";
import { IncorrectCredentialsError } from "@src/shared/errors/user-errors";

@injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<PasswordHash> {
    const hash = await argon2.hash(password);

    return new PasswordHash(hash);
  }

  async compare(password: string, hash?: PasswordHash): Promise<boolean> {
    if (!hash) {
      throw new IncorrectCredentialsError();
    }

    return argon2.verify(hash.getValue(), password);
  }
}
