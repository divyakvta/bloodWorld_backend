import { NextFunction, Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { error } from 'console';
import { UserModel } from '../models/userModel';

//User Signup

class UserController {
    public async signup(req: Request, res: Response, next:NextFunction): Promise<void> {
        console.log(req.body)
        const { name, email, password,confirmPassword, phone } = req.body.formData;

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
            const newUser = new UserModel({ name,email,password:hashedPassword, phone });
           const userData =  await newUser.save();

            const token = jwt.sign({ userId:newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        
            res.status(201).json(userData);
        }catch(error) {
            console.log("err")
            next(error);
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
            const usreData = await UserModel.findOne({_id: req.params.userId});

            res.status(200).json(usreData);

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

}





export default UserController;

