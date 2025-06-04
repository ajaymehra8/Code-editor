import {  Request,Response, NextFunction } from "express";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { createJwt } from "../utils/token";
import Email from "../utils/Email";
import dns from "dns";
import crypto from "crypto";
import { MyRequest } from "../types/local";
import jwt from "jsonwebtoken";
import {oauth2client} from "../config/googleOauth";
import axios from 'axios';

// Define OTP storage
interface OtpStore {
  [key: string]: { otpS: string; expiryTime: number };
}

let otpStore: OtpStore = {};

// Function to validate email domain
async function validateEmailDomain(
  next: NextFunction,
  email: string
): Promise<boolean | void> {
  const domain = email.split("@")[1];
  if (!domain) {
    return next(new AppError(400, "Invalid email format: Missing domain"));
  }

  try {
    const addresses = await dns.promises.resolveMx(domain);
    if (!addresses || addresses.length === 0) {
      return next(
        new AppError(
          400,
          "Invalid email: Domain has no mail server (MX records)"
        )
      );
    }
    return true;
  } catch (err: any) {
    console.error("DNS Lookup Error:", err.message);

    if (err.code === "ENOTFOUND") {
      return next(new AppError(400, `Invalid email`));
    }
    return next(new AppError(500, "Error validating email domain"));
  }
}

// Function to generate OTP
function generateOTP(): string {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    const digit = randomByte % 10;
    otp += digit.toString();
  }
  return otp;
}

// Function to create OTP
const createOTP = (email: string): string => {
  const otpS = generateOTP();
  const expiryTime = Date.now() + 5 * 60 * 1000;
  otpStore[email] = { otpS, expiryTime };
  return otpS;
};

// Send OTP controller
export const sendOtp = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return next(new AppError(400, "Please provide a email"));
    }
    const user = await User.findOne({ email });
    if (user) {
      return next(new AppError(400, "User with this email already exists"));
    }
    const isValidEmail = await validateEmailDomain(next, email);
    if (!isValidEmail) return;
    const otp = createOTP(email);
    const mail = new Email({ email });
    mail.sendOtp(otp);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully (valid for 5 minutes)",
    });
  }
);

// Verify OTP controller
export const verifyOtp = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new AppError(400, "Please provide all required fields."));
    }
    const storedOtpData = otpStore[email];
    if (!storedOtpData) {
      return next(new AppError(404, "OTP not found for this email"));
    }
    const { otpS, expiryTime } = storedOtpData;
    if (Date.now() > expiryTime) {
      delete otpStore[email];
      return next(new AppError(401, "OTP has expired."));
    }
    if (otp !== otpS) {
      return next(new AppError(401, "Invalid OTP, Please try again."));
    }
    delete otpStore[email];
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  }
);

// Signup controller
export const signup = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { email, password,name } = req.body;
    if (!email || !password || !name) {
      return next(new AppError(400, "Provide all required fields"));
    }

    const user = await User.create({ email, password,name });
    if (!user) {
      return next(new AppError(500, "Problem in sign up."));
    }

    const token = createJwt(user);

    res.status(200).json({
      success: true,
      message: "Your account was created successfully",
      user,
      token,
    });
  }
);

// Login controller
export const login = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(400, "Please provide all required fields"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(404, "No user exists with this email."));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError(401, "Incorrect password, try again."));
    }

    const token = createJwt(user);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  }
);

// google login
export const googleLogin = catchAsync(async (req:Request, res:Response) => {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const {email,name,picture}=userRes.data;
    let user=await User.findOne({email});
    if(!user){
      user=await User.create({email,name,image:picture});
    }
    const token=createJwt(user);
    res.status(201).json({
      success:true,
      user,
      token,
      message:'Login successfully'
    }
    )
  
});


// isProtect (check if user is logged in)
export const isProtect = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        success: false,
        message: "You are not logged in, Please login!",
      });
      return;
    }
    console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError(404, "User not found"));
      }
      req.user = user;
      next();
    } catch (err) {
      return next(new AppError(401, "Invalid or expired token"));
    }
  }
);
