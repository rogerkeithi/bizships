import { Container } from "inversify";
import { TYPES } from "../types";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { AuditRepository } from "@src/infra/database/mongo/repositories/audit-repository";

export function registerAuditModule(container: Container) {
  container.bind<IAuditRepository>(TYPES.IAuditRepository).to(AuditRepository);
}
