import { Router } from "express";
import UserController from '../controllers/userController'

const router = Router();
const userController = new UserController()
// -------------------------------------------| USER SIGNUP |-----------------------------------------------------------------------------------------------------
router.post('/signup', userController.signup);

// -------------------------------------------| USER SIGNUP |-----------------------------------------------------------------------------------------------------
router.get('/verify_user/:id', userController.VerifyOtp);

// -------------------------------------------| UPDATE OTP CONFIRMATION CODE TO THE DB |-----------------------------------------------------------------------------------------------------
router.post('/update_otp/:id', userController.FindUserAndUpdateOtp);

// -------------------------------------------| FIND USER BY ID |-----------------------------------------------------------------------------------------------------
router.get("/get_user/:userId", userController.FindUserById);

// -------------------------------------------| USER LOGIN VERIFY |-----------------------------------------------------------------------------------------------------
router.post('/login', userController.login)

// -------------------------------------------| USER DETAILS UPDATE |-----------------------------------------------------------------------------------------------------

router.put('/update_user/:userId', userController.updateUser)

// -------------------------------------------| USER Status UPDATE |-----------------------------------------------------------------------------------------------------

router.post('/update_status/:userId', userController.updateUserStatus)

// -------------------------------------------| FIND ALL USERS |-----------------------------------------------------------------------------------------------------

router.get('/get_users/', userController.FindUsers)

// -------------------------------------------| USER DETAILS UPDATE |-----------------------------------------------------------------------------------------------------

export default router;