import { Audit } from "../entities/Audit";

export interface IAuditRepository {
  create(data: Audit): Promise<void>;
}
