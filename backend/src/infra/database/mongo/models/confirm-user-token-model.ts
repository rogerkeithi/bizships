import mongoose from "mongoose";

const ConfirmUserTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const ConfirmUserTokenModel = mongoose.model(
  "ConfirmUserToken",
  ConfirmUserTokenSchema,
);
