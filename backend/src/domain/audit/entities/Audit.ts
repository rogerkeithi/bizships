import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";

export type Audit = {
  action: AuditAction;
  userId: string;
  actionDescription?: string;
  entityId?: string;
  entity?: Entity;
};
