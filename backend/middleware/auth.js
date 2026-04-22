import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    
    // Find user – fall back to email if userId is missing (legacy accounts)
    const user = await User.findOne(
      decoded.userId
        ? { userId: decoded.userId }
        : { email: decoded.email }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "User account is blocked"
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};
