import { injectable } from "inversify";
import { AuditModel } from "../models/audit-model";
import { randomUUID } from "crypto";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { Audit } from "@src/domain/audit/entities/Audit";

@injectable()
export class AuditRepository implements IAuditRepository {
  async create(data: Audit): Promise<void> {
    const auditId = randomUUID();

    await AuditModel.create({
      auditId: auditId,
      action: data.action,
      actionDescription: data.actionDescription,
      entityId: data.entityId,
      entity: data.entity,
      userId: data.userId,
    });
  }
}
