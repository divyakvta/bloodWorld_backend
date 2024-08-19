import { NextFunction, Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { error } from 'console';
import { UserModel } from '../models/userModel';
import mongoose from 'mongoose';
import moment from 'moment';

//User Signup

class UserController {
    public async signup(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log(req.body)
        const { name, email, age, city, district, bloodGroup, password, confirmPassword, phone, role, lastDonated } = req.body;

        if(password !== confirmPassword) {
            res.json({ error: 'Passwords do not match' });
            return;
        }
        
        try {

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
              res.json({ error: "Email already exists" });
              return;
            }

            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = new UserModel({
                name,
                age,
                email,
                city,
                district,
                bloodGroup,
                password: hashedPassword,
                phone,
                role,
                lastDonated
            });
           const userData =  await newUser.save();
           console.log(userData)

            const token = jwt.sign({ userId:newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        
            res.status(201).json(userData);
        }catch(error) {
            console.log("Error saving user:", error)
            next(error);
        }
    }

    public async VerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = req.params.id;
            
            const updated = await UserModel.findByIdAndUpdate({_id: id},{
                $set: {
                    verified: true
                }
            }, {new: true});

            if(updated){
                res.json({verified: true});
            }else{
                res.json({verfied: false});
            }
        } catch (error) {
            next(error)
        }
    }

    //User Login
    
    public async FindUserAndUpdateOtp(req: Request, res: Response): Promise<void>{
        try {
        
            const updated = await  UserModel.findOneAndUpdate({_id: req.body.id}, {
                $set: {
                    otp: req.body.otp
                }
            },{new: true});
          if(updated){
            res.status(200).json(updated)
          }else{
            res.json("updating otp was failed");
          }
        } catch (error: any) {
            // next(error)
        }
    }

    public async FindUserById(req: Request, res: Response): Promise<void>{
        try {

            const {userId} = req.params;
            console.log(userId)

            if (!mongoose.Types.ObjectId.isValid(userId)) {
             res.status(400).json({ message: 'Invalid user ID format' });
            }

            const userData = await UserModel.findOne({_id: userId});
            console.log(userData)

            res.status(200).json(userData);

        } catch (error) {
            console.log(error)
        }
    }

    public async login(req:Request, res:Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        try {
            
            const user = await UserModel.findOne({ email });
            // console.log(user)
            if(!user) {
                res.json({ message: 'Invalid credentials', userData: null});
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                res.json({ message: 'Invalid credentials', userData: null })
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

            res.status(200).json({message: "login success", userData: user});

        }catch (error) {
            next(error)
        }
    }

    public async updateUser(req:Request, res: Response, next: NextFunction): Promise<void> {
        const { name, phoneNumber, email, age, bloodGroup, city, district, lastDonation } = req.body;

        try {
            const userId = req.params.userId;

            const updatedData = { name, phoneNumber, email, age, bloodGroup, city, district, lastDonation };

            const user = await UserModel.findById(userId);

            if(!user) {
                res.status(404).json({ message: 'User not found', userData: null});
                return;
            }

            Object.assign(user, updatedData);
            await user.save();

            res.status(200).json({ message: 'User details updated successfully', userData: user})
        }catch (error) {
            next(error)
        }
    }

    public async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {

        const userId = req.params.userId;
        const { toggle, checklastDonation } = req.body;

        try {
            const user = await UserModel.findById(userId);

            if(!user) {
                res.status(404).json({ message: 'User not found'});
                return;
            }

            if (toggle) {
                user.isActive = !user.isActive;
            }

            if(checklastDonation) {
                const lastDonationDate = moment(user.lastDonated);
                const currentDate = moment();
                const yearsDiff = currentDate.diff(lastDonationDate, 'years');

                if (yearsDiff > 2) {
                    user.isActive = false;
                } 
            }
            await user.save();

            res.status(200).json({ message: 'User status updated successfully', status:user.isActive });
        }catch (error) {
            next(error);
        }
    }

    public async FindUsers(req: Request, res: Response): Promise<void>{
        try {

            const users = await UserModel.find({isActive: true, role: "Donor"});
            console.log(users)

            res.status(200).json(users);

        } catch (error) {
            console.log(error)
        }
    }

}





export default UserController;

