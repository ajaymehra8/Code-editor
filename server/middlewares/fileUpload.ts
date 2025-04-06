import multer, { StorageEngine } from "multer";
import { MyRequest } from "../types/local";
import cloudinary from "../config/cloudinaryConfig";
import streamifier from "streamifier";
import { Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const multerStorage: StorageEngine = multer.memoryStorage();

const multerFilter = (
  req: MyRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Not an image! Please upload only images."));
  }
};

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: multerFilter,
});

export const uploadUserImageToCloudinary = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError(400, "No user logged in"));
    }
    if (!req.file) {
      return next();
    }

    // 1️⃣ Delete the old image if it exists
    if (req.user?.image?.name) {
      const publicId = `user_images/${req.user.image.name}`; // Assuming images are in "user_images" folder
      await cloudinary.uploader.destroy(publicId);
    }

    // 2️⃣ Create a custom name: "user_email-userId"
    const imageName = `${req.user.email}-${req.user.id}`;
    // 3️⃣ Upload new image with a public ID
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "user_images",
            public_id: imageName,
            overwrite: true,
            format: "webp", // Use WebP for better compression without quality loss
            quality: "auto:best", // Ensures highest possible quality
            fetch_format: "auto", // Converts to best format
            crop: "limit", // Prevents unnecessary resizing
            width: 1080, // Ensure HD resolution
            height: 1080,
          },
          (error, result) => {
            if (error)
              reject(new AppError(500, "Error uploading image to Cloudinary"));
            else resolve(result as { secure_url: string; public_id: string });
          }
        );

        if (req.file) {
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        } else {
          reject(new AppError(400, "File buffer is missing"));
        }
      }
    );

    // 4️⃣ Attach image details to the request
    req.body.image = {
      name: imageName,
      link: result.secure_url,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error); // Pass to Express error handler
  }
};

export const uploadGroupImageToCloudinary = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError(400, "No user logged in"));
    }
    if (!req.file) {
      return next();
    }

   

    // 2️⃣ Create a custom name: "user_email-userId"
    const imageName = `${req.user.email}-${req.user.id}-${new Date()}`;
    // 3️⃣ Upload new image with a public ID
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "user_images",
            public_id: imageName,
            overwrite: true,
            format: "webp", // Use WebP for better compression without quality loss
            quality: "auto:best", // Ensures highest possible quality
            fetch_format: "auto", // Converts to best format
            crop: "limit", // Prevents unnecessary resizing
            width: 1080, // Ensure HD resolution
            height: 1080,
          },
          (error, result) => {
            if (error)
              reject(new AppError(500, "Error uploading group image to Cloudinary"));
            else resolve(result as { secure_url: string; public_id: string });
          }
        );

        if (req.file) {
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        } else {
          reject(new AppError(400, "File buffer is missing"));
        }
      }
    );

    // 4️⃣ Attach image details to the request
    req.body.groupImage = {
      name: imageName,
      link: result.secure_url,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error); // Pass to Express error handler
  }
};

export const uploadUserPhoto = upload.single("image");
export const uploadGroupPhoto=upload.single("groupImage");
