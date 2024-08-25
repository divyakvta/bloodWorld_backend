import express from "express";
import AdminController from "../controllers/adminController";

const router = express.Router();

// Admin login route
router.post("/login", AdminController.login);

// Refresh token route
router.post("/refresh-token", AdminController.refreshToken);

router.get("/get_donors", AdminController.getDonors);

router.post("/toggle_activation", AdminController.toggleActivation);

router.get("/get_recipients", AdminController.getRecipients);

export default router;
