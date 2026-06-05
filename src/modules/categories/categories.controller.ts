import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as categoryService from "@/modules/categories/categories.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getCategories = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await categoryService.getPublicCategories();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Categories fetched successfully"));
});

export const getCategoryTree = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await categoryService.getPublicCategoryTree();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Category tree fetched successfully"));
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.getPublicCategoryBySlug(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Category fetched successfully"));
});

export const createCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.createCategory(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Category created successfully"));
});

export const updateCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.updateCategory(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Category updated successfully"));
});

export const deleteCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await categoryService.deleteCategory(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Category deleted successfully"));
});
