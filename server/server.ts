import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import db from "./config/db";
import AppError from "./utils/AppError";
import authRoutes from "./routes/authRoutes";
import snippetRoutes from "./routes/snippetRoutes";

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
db();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/snippet", snippetRoutes);

// default route
app.get("/", (req: Request, res: Response) => {
  res.json("Working");
});

// Handle all other routes (404 Not Found)
app.use("/*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});

// Error Handling Middleware
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
