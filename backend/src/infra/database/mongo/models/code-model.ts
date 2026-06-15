import { CodeType } from "@src/shared/enums/code-type";
import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema(
  {
    codeId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    codeType: {
      type: String,
      required: true,
      enum: Object.values(CodeType),
    },
    codeHash: { type: String, required: true },
    redeemTries: { type: Number, default: 0 },
    valid: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const CodeModel = mongoose.model("Code", CodeSchema);
