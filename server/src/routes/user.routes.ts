import express from "express";
import {
  googleAuth,
  registerUser,
  resendOtp,
  verifyOtp,
} from "../controller/user.controller.js";

const router = express.Router();

// When a POST request is made to '/register', the registerUser function will run
router.post("/register", registerUser);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/google-auth", googleAuth);

export default router;
