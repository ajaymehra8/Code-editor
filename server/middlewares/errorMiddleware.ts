import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  code?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  if (err.isOperational) {
    console.log("Operational Error Code:", err.code);
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("Unexpected Error:", err); // Log for debugging

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong! Please try again later.",
  });
};
