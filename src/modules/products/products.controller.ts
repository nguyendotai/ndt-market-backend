import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as productService from "@/modules/products/products.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await productService.getPublicProducts(req.query as never);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(result.products, "Products fetched successfully", result.meta));
});

export const getProductBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await productService.getPublicProductBySlug(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Product fetched successfully"));
});

export const getRelatedProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await productService.getRelatedProducts(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Related products fetched successfully"));
});

export const createProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await productService.createProduct(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Product created successfully"));
});

export const updateProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await productService.updateProduct(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Product updated successfully"));
});

export const deleteProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await productService.deleteProduct(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Product deleted successfully"));
});

export const createProductVariant = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await productService.createProductVariant(String(req.params.id), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Product variant created successfully"));
});

export const updateProductVariant = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await productService.updateProductVariant(String(req.params.variantId), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Product variant updated successfully"));
});

export const deleteProductVariant = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  await productService.deleteProductVariant(String(req.params.variantId));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Product variant deleted successfully"));
});

export const createProductImage = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await productService.createProductImage(String(req.params.id), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Product image created successfully"));
});

export const deleteProductImage = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  await productService.deleteProductImage(String(req.params.imageId));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Product image deleted successfully"));
});
