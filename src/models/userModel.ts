import { Schema, model, Document } from 'mongoose';

//  Define interface
interface IUser extends Document {
  name: string;
  age: number;
  email: string;
  city: string;
  district: string;
  bloodGroup: string;
  password: string;
  phone: string;
  role: string;
  lastDonated: string;
  otp: string;
  verified: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
      required: true
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
      required: true 
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



export const UserModel = model<IUser>('User', userSchema);

