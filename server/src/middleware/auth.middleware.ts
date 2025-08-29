import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";

export interface AuthRequest extends Request {
  user?: any;
}

// Your token payload
interface DecodedToken extends JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // const token = authHeader && authHeader.split(" ")[5];
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret);

    // ✅ Narrow type: reject if string
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // ✅ Now it's safe to treat decoded as DecodedToken
    const { id } = decoded as unknown as DecodedToken;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
