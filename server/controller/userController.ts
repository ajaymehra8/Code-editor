import { NextFunction, Response } from "express";
import { MyRequest } from "../types/local";
import Snippet from "../models/snippetModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import mongoose from "mongoose";

export const getUserStats = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const userId =new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    console.log("working stats");
    const result = await Snippet.aggregate([
      {
        $facet: {
          totalSnippetsByUser: [
            { $match: { user: userId } },
            { $count: "count" },
          ],
          snippetsLast24h: [
            { $match: { user: userId, createdAt: { $gte: yesterday } } },
            { $count: "count" },
          ],
          snippetsStarredByUser: [
            { $match: { starredBy: userId } },
            { $count: "count" },
          ],
          mostStarredLanguage: [
            { $unwind: "$starredBy" },
            { $group: { _id: "$language", starCount: { $sum: 1 } } },
            { $sort: { starCount: -1 } },
            { $limit: 1 },
          ],
          languageStats: [
            { $match: { user: userId } },
            {
              $group: {
                _id: "$language",
                count: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: null,
                languages: { $addToSet: "$_id" },
                mostUsed: { $max: "$count" },
                all: { $push: { language: "$_id", count: "$count" } },
              },
            },
            {
              $project: {
                languageCount: { $size: "$languages" },
                mostUsedLanguage: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$all",
                        as: "lang",
                        cond: { $eq: ["$$lang.count", "$mostUsed"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ],
        },
      },
    ]);
    console.log(result);
    if (!result) {
      next(new AppError(500, "User stats are empty"));
      return;
    }
    res.status(200).json({
      success: true,
      stats: result[0],
    });
  }
);
