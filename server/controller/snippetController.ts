import catchAsync from "../utils/catchAsync";
import { MyRequest } from "../types/local";
import { NextFunction, Response } from "express";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import Snippet from "../models/snippetModel";
export const createSnipeet = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const {
      title,
      language,
      code,
    }: { title: string; language: string; code: string } = req.body;
    if (!title || !language || !code) {
      next(new AppError(400, "Provide all required fields"));
      return;
    }
    const user = req.user;
    if (!user) {
      next(new AppError(401, "You are not authorized"));
      return;
    }
    const userId = new mongoose.Types.ObjectId(user?._id);
    const snippet = await Snippet.create({
      user: userId,
      title,
      language,
      code,
    });
    res.status(200).json({
      success: true,
      message: "Snippet added successfully",
      snippet,
    });
  }
);

// get all snippet

export const getAllSnippet = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    let snippetId = req.query.snippetId as string;
    if (snippetId) {
      const id = new mongoose.Types.ObjectId(snippetId);
      const snippet = await Snippet.findById(id).populate("user");
      if (!snippet) {
        next(new AppError(404, "Snippet Not Found"));
        return;
      }
      res.status(200).json({
        success: true,
        message: "Snippet fetched",
        snippet,
      });
      return;
    }
    const snippets = await Snippet.find({})
      .limit(10)
      .populate("user")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All snippets are fetched",
      snippets,
    });
  }
);

// delete a snippet
export const deleteSnippet = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new AppError(401, "You are not authorized"));
      return;
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    let snippetId = req.query.snippetId;
    if (!snippetId) {
      next(new AppError(400, "Please select a snippet"));
      return;
    }
    const id = new mongoose.Types.ObjectId(snippetId as string);
    const snippet = await Snippet.findById(id);
    if (!snippet) {
      next(new AppError(404, "No snippet found."));
      return;
    }
    if (!snippet.user.equals(userId)) {
      next(new AppError(401, "You have no access to this snippet"));
      return;
    }
    await Snippet.findByIdAndDelete(snippet._id);
    res.status(200).json({
      success: true,
      message: "Snippet deleted.",
    });
  }
);

// Star a snippet
export const addStar = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { snippetId } = req.body;
    console.log(snippetId);
    const userId = req.user._id;
    if (!snippetId) {
      next(new AppError(400, "Please select a snippet"));
      return;
    }
    const snippet = await Snippet.findById(snippetId);

    if (!snippet) {
      next(new AppError(404, "Snippet not found"));
      return;
    }
    const alreadyStarred = snippet.starredBy?.includes(userId);

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      snippetId,
      alreadyStarred
        ? { $pull: { starredBy: userId } }
        : { $addToSet: { starredBy: userId } },
      { new: true }
    ).populate("user");

    res.status(200).json({
      success: true,
      message: alreadyStarred
        ? "Snippet removed from starred."
        : "Snippet starred successfully",
      snippet: updatedSnippet,
    });
  }
);
