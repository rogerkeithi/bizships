import argon2 from "argon2";
import { IPasswordHasher } from "./password-hasher.interface";
import { PasswordHash } from "@src/domain/user/value-objects/PasswordHash";

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<PasswordHash> {
    const hash = await argon2.hash(password);

    return new PasswordHash(hash);
  }

  async compare(password: string, hash: PasswordHash): Promise<boolean> {
    return argon2.verify(hash.getValue(), password);
  }
}
