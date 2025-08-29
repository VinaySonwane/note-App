import type { Request, Response } from "express";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
// ==> ADD THIS IMPORT
import { OAuth2Client } from "google-auth-library";

// ==> INITIALIZE THE GOOGLE CLIENT
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate a JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Token will be valid for 30 days
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, dob } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({ name, email, dob });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Your OTP for Note App",
        text: `Welcome to Note App! Your One-Time Password is: ${otp}`,
      });

      res.status(201).json({
        message: "Registration successful! An OTP has been sent to your email.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res
        .status(500)
        .json({ message: "User registered, but failed to send OTP." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your New Note App OTP",
      text: `Your new One-Time Password is: ${otp}`,
    });

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ==> ADD THIS NEW FUNCTION
export const googleAuth = async (req: Request, res: Response) => {
  const { credential } = req.body; // 'credential' is the token from Google

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create them
      user = await User.create({
        name,
        email,
        dob: new Date(), // Placeholder DOB, as Google doesn't provide it
      });
    }

    // Return our application's JWT
    res.status(200).json({
      message: "Google sign-in successful!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
