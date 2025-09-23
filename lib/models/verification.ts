// lib/models/verification.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

interface VerificationCode extends Document {
  email: string;
  code: string;
  type?: string; // 'registration' ou 'password_reset'
  userData?: IUser;
  createdAt: Date;
  expiresAt: Date;
}

const verificationSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'registration',
  },
  userData: {
    type: Schema.Types.Mixed,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationModel =
  mongoose.models.Verification ||
  mongoose.model<VerificationCode>("Verification", verificationSchema);

export default VerificationModel;
