import { Schema, model, Document } from 'mongoose';

//  Define interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  otp: string | number;
  phone: number;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a schema corresponding to the document interface.

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      uniqueCaseInsensitive: true 
    },
    phone:{
     type: Number,
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    otp: {
      type: String,
      // required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
  },
  {
    timestamps: true
  }
);



export const UserModel = model<IUser>('User', userSchema);

