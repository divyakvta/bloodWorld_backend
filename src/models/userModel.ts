import { Schema, model, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

//  Define interface
interface IUser extends Document {
  name: string;
  age: number;
  email: string;
  city: string;
  district: string;
  bloodGroup: string;
  password: string;
  phone?: string;
  role: string;
  lastDonated: string;
  nextDonation: Date;
  otp: string;
  verified: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Create a schema corresponding to the document interface.

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true 
    },
    age: { 
      type: Number, 
      required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    city: { 
      type: String, 
      required: true
     },
    district: { 
      type: String, 
      required: true,
      enum: [
        'Alappuzha', 
        'Ernakulam', 
        'Idukki', 
        'Kannur', 
        'Kasaragod', 
        'Kollam', 
        'Kottayam', 
        'Kozhikode', 
        'Malappuram', 
        'Palakkad', 
        'Pathanamthitta', 
        'Thiruvananthapuram', 
        'Thrissur', 
        'Wayanad'
    ] 
    },
    bloodGroup: { 
      type: String, 
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
    },
    password: { 
      type: String, 
      required: false 
    },
    phone: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['Donor', 'Recipient'], 
      required: true 
    },
    nextDonation: {
      type: Date,
    },
    lastDonated: {
      type: String,
    },
    otp: {
      type: String,
      // required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
  },
  {
    timestamps: true
  }
);


userSchema.pre<IUser>("save", async function (next) {

  if(!this.isModified('password')) return next()

    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (err) {
      next(err as CallbackError);
    }
})

userSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
     {
       _id: this._id,
       email: this.email,
     },
     process.env.JWT_SECRET as string,
     { expiresIn: "1h" }
   );
 };
 
 userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
     {
       _id: this._id,
     },
     process.env.JWTREFRESH_SECRET as string,
     { expiresIn: "10d" }
   );
 };



export const UserModel = model<IUser>('User', userSchema);

