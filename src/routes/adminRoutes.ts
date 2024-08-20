import express from "express";
import AdminController from "../controllers/adminController";

const router = express.Router();

// Admin login route
router.post("/login", AdminController.login);

// Refresh token route
router.post("/refresh-token", AdminController.refreshToken);

export default router;
