import { Container } from "inversify";
import { TYPES } from "../types";
import { Argon2PasswordHasher } from "@src/services/password-hasher/password-hasher";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";

export function registerPasswordHasherModule(container: Container) {
  container
    .bind<IPasswordHasher>(TYPES.IPasswordHasher)
    .to(Argon2PasswordHasher);
}
