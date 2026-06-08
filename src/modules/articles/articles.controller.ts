import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as articleService from "@/modules/articles/articles.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getArticles = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await articleService.getPublicArticles();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Articles fetched successfully"));
});

export const getArticleBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await articleService.getPublicArticleBySlug(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Article fetched successfully"));
});

export const createArticleCategory = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await articleService.createArticleCategory(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Article category created successfully"));
});

export const createArticle = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await articleService.createArticle(getUserId(req), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Article created successfully"));
});

export const updateArticle = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await articleService.updateArticle(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Article updated successfully"));
});

export const deleteArticle = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await articleService.deleteArticle(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Article deleted successfully"));
});
