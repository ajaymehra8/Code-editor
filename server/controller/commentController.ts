import { NextFunction, Response } from "express";
import Comment from "../models/snippetComment";
import { MyRequest } from "../types/local";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import Snippet from "../models/snippetModel";

export const doComment = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { snippetId, content } = req.body;
    console.log("do comment");

    if (!content) {
      next(new AppError(400, "Comment should contain content"));
      return;
    }
    if (!snippetId) {
      next(new AppError(404, "Snippet is not found"));
      return;
    }
    const comment = await Comment.create({
      user: userId,
      snippet: snippetId,
      content,
    });
    if (!comment) {
      next(new AppError(500, "Comment is not posted"));
      return;
    }
    const commentToSend = await Comment.findById(comment._id).populate("user");
    res.status(200).json({
      success: true,
      message: "Comment posted successfully",
      comment: commentToSend,
    });
  }
);

export const getAllComments = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { snippetId } = req.query;
    if (!snippetId) {
      next(new AppError(400, "Select a snippet"));
      return;
    }
    const snippetObId = new mongoose.Types.ObjectId(snippetId as string);
    const snippet = await Snippet.findById(snippetObId);
    if (!snippet) {
      next(new AppError(404, "Snippet not found"));
      return;
    }
    const comments = await Comment.find({ snippet: snippetObId }).populate(
      "user"
    );
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  }
);

export const deleteComment = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log(req.params.commentId,"body");
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);
    console.log(commentId);
    if (!commentId) {
      next(new AppError(400, "Please select a comment"));
      return;
    }
    const comment = await Comment.findById(commentId);
    console.log(comment);
    if (!comment) {
      next(new AppError(404, "No comment found"));
      return;
    }
    if (!comment.user._id.equals(userId)) {
      next(new AppError(404, "You are not admin of the comment"));
      return;
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(204).json({
      success:true,
      message:"Comment is deleted successfully",
    });
  }
);
