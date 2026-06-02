import { PasswordHash } from "@src/domain/user/value-objects/PasswordHash";

export interface IPasswordHasher {
  hash(password: string): Promise<PasswordHash>;

  compare(password: string, hash: PasswordHash): Promise<boolean>;
}
