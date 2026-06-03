import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const RefreshTokenModel = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema,
);
