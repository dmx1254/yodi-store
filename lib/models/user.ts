import { model, models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  password: string;
}

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: false },
    country: { type: String, required: false },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = models.user || model<IUser>("user", userSchema);
export default UserModel;
