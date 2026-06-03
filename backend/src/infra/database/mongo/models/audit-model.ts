import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";
import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(AuditAction),
    },
    actionDescription: {
      type: String,
      required: false,
    },
    entityId: {
      type: String,
      required: false,
    },
    entity: {
      type: String,
      required: false,
      enum: Object.values(Entity),
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AuditModel = mongoose.model("Audit", AuditSchema);
