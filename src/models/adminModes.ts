import mongoose from "mongoose";
import { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

adminSchema.methods.isPasswprdCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
 return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

adminSchema.methods.generateRefreshToken = function () {
 return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWTREFRESH_SECRET as string,
    { expiresIn: "10d" }
  );
};

const Admin = mongoose.model<IUser>("User", adminSchema);

export default Admin;
