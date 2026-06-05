import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as userAddressService from "@/modules/user-addresses/user-addresses.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getMyAddresses = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.getMyAddresses(getUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Addresses fetched successfully"));
});

export const createMyAddress = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.createMyAddress(getUserId(req), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Address created successfully"));
});

export const updateMyAddress = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.updateMyAddress(getUserId(req), String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Address updated successfully"));
});

export const deleteMyAddress = catchAsync(async (req: Request, res: Response) => {
  await userAddressService.deleteMyAddress(getUserId(req), String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Address deleted successfully"));
});

export const setMyDefaultAddress = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.setMyDefaultAddress(getUserId(req), String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Default address updated successfully"));
});

export const getAllAddresses = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.getAllAddresses(req.query.userId as string | undefined);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Addresses fetched successfully"));
});

export const createAddressForUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.createAddressForUser(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Address created successfully"));
});

export const updateAddressByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.updateAddressByAdmin(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Address updated successfully"));
});

export const deleteAddressByAdmin = catchAsync(async (req: Request, res: Response) => {
  await userAddressService.deleteAddressByAdmin(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Address deleted successfully"));
});

export const setDefaultAddressByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userAddressService.setDefaultAddressByAdmin(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Default address updated successfully"));
});
