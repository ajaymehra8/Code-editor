import express from "express";
import * as authController from "../controller/authController";

const router = express.Router();

router.get("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

export default router;
