import mongoose, { Document, Schema, Types } from "mongoose";

// 1. Create a more precise TypeScript interface
export interface IUser extends Document {
  _id: Types.ObjectId; // Explicitly define the type for _id
  name: string;
  email: string;
  dob: Date;
  otp?: string | undefined; // Explicitly allow undefined
  otpExpires?: Date | undefined; // Explicitly allow undefined
}

// The schema definition remains the same
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    otp: {
      type: String,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
