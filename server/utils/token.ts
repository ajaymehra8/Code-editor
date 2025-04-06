import jwt from "jsonwebtoken";

import { IUser } from "../models/userModel";

export const createJwt = (user: IUser): string => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5d" });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "JWT creation failed");
  }
};
