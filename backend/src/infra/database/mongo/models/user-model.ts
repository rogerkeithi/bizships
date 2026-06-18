import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    country: String,
    postalCode: String,
    state: String,
    city: String,
    district: String,
    street: String,
    number: String,
    complement: String,
  },
  {
    _id: false,
  },
);

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
    },
    firstName: String,
    lastName: String,
    socialName: String,
    birthDate: Date,
    phone: String,
    phoneVerifiedAt: Date,
    passwordHash: String,
    deactivatedAt: Date,
    address: AddressSchema,
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model("User", UserSchema);
