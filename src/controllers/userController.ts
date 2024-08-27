import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import mongoose from "mongoose";
import moment from "moment";
import { SendEmail } from "../twilioService";

//User Signup

class UserController {
  public async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body);
    const {
      name,
      email,
      age,
      city,
      district,
      bloodGroup,
      password,
      confirmPassword,
      phone,
      role,
      lastDonated,
    } = req.body;

    if (password !== confirmPassword) {
      res.json({ error: "Passwords do not match" });
      return;
    }

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.json({ error: "Email already exists" });
        return;
      }

      const newUser = new UserModel({
        name,
        age,
        email,
        city,
        district,
        bloodGroup,
        password,
        phone,
        role,
        lastDonated,
      });
      const userData = await newUser.save();
      console.log('Saved user data:',userData);
      

      res.status(201).json({userData,
        message: "Signup successful",
      });
    } catch (error) {
      console.error("Error saving user:", error);
      next(error);
    }
  }

  public async VerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {
      const id  = req.params.id;
      console.log("😜" + id)

      const updated = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            verified: true,
          },
        },
        { new: true }
      );

      if (updated) {
        res.json({ verified: true });
      } else {
        res.json({ verfied: false });
      }
    } catch (error) {
      next(error);
    }
  }
  //User Login

  public async FindUserAndUpdateOtp(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const updated = await UserModel.findOneAndUpdate(
        { _id: req.params.id},
        {
          $set: {
            otp: req.body.otp,
          },
        },
        { new: true }
      );
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.json("updating otp was failed");
      }
    } catch (error: any) {
      // next(error)
    }
  }

  public async FindUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      console.log("UserID:", userId);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID format" });
      }

      const userData = await UserModel.findOne({ _id: userId });
      console.log(userData);

      res.status(200).json(userData);
    } catch (error) {
      console.log(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      // console.log(user)
      if (!user) {
        res.json({ message: "Invalid credentials", userData: null });
        return;
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken(); 

      res.cookie('refreshTokenUser', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000 
      });

      res.status(200).json({
        message: "Login successful",
        userData: user,
        tokens: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      name,
      phoneNumber,
      email,
      age,
      bloodGroup,
      city,
      district,
      lastDonation,
    } = req.body;

    try {
      const userId = req.params.userId;

      const updatedData = {
        name,
        phoneNumber,
        email,
        age,
        bloodGroup,
        city,
        district,
        lastDonation,
      };

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found", userData: null });
        return;
      }

      Object.assign(user, updatedData);
      await user.save();

      res
        .status(200)
        .json({ message: "User details updated successfully", userData: user });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.userId;
    const { toggle, checklastDonation } = req.body;

    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (toggle) {
        user.isActive = !user.isActive;
      }

      if (checklastDonation) {
        const lastDonationDate = moment(user.lastDonated);
        const currentDate = moment();
        const yearsDiff = currentDate.diff(lastDonationDate, "years");

        if (yearsDiff > 2) {
          user.isActive = false;
        }
      }
      await user.save();

      res
        .status(200)
        .json({
          message: "User status updated successfully",
          status: user.isActive,
        });
    } catch (error) {
      next(error);
    }
  }

  public async FindUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find({ isActive: true, role: "Donor" });
      console.log(users);

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  }

  public scheduleDonation = async (req: Request, res: Response): Promise<void> => {
    const { userId, date, requestType }: { userId: string; date: string; requestType: 'normal' | 'urgent' } = req.body;
      console.log("shedule controller...");
      console.log(req.body)
    console.log(userId)
    try {
      const acceptUrl = `http://localhost:3000/accept-schedule/${userId}`;
      const rejectUrl = `http://localhost:3000/reject-schedule/${userId}`;

      const message = `You have a ${requestType} blood donation request scheduled on ${date}. Please confirm:\nAccept: ${acceptUrl}\nReject: ${rejectUrl}`;
       const userData: any = await UserModel.findOne({_id: userId});
      const response = await SendEmail(userData.email, message);
    
      if(response.success){
        res.json({ success: true });
      }else{
        res.json({ success: false });
      }
   
    }catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

export default UserController;
