import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      next(new AppError(err.statusCode || 500, err.message || "Unknown error occurred"));
    });
  };
};

export default catchAsync;
