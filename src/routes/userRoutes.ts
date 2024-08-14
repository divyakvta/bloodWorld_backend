import { Router } from "express";
import UserController from '../controllers/userController'

const router = Router();
const userController = new UserController()
// -------------------------------------------| USER SIGNUP |-----------------------------------------------------------------------------------------------------
router.post('/signup', userController.signup);

// -------------------------------------------| UPDATE OTP CONFIRMATION CODE TO THE DB |-----------------------------------------------------------------------------------------------------
router.post('/update_otp', userController.FindUserAndUpdateOtp);

// -------------------------------------------| FIND USER BY ID |-----------------------------------------------------------------------------------------------------
router.get("/get_user/:userId", userController.FindUserById);

// -------------------------------------------| USER LOGIN VERIFY |-----------------------------------------------------------------------------------------------------
router.post('/login', userController.login)



export default router;