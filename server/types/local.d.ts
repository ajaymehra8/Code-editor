import express from "express";
import { JwtPayload } from "../utils/authUtils";

export type MyRequest = express.Request & {
  user?: JwtPayload;
};
