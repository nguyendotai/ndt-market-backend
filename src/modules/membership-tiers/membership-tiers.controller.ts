import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as membershipTierService from "@/modules/membership-tiers/membership-tiers.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getMembershipTiers = catchAsync(async (_req: Request, res: Response) => {
  const result = await membershipTierService.getMembershipTiers();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Membership tiers fetched successfully"));
});

export const getMembershipTierById = catchAsync(async (req: Request, res: Response) => {
  const result = await membershipTierService.getMembershipTierById(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Membership tier fetched successfully"));
});

export const createMembershipTier = catchAsync(async (req: Request, res: Response) => {
  const result = await membershipTierService.createMembershipTier(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Membership tier created successfully"));
});

export const updateMembershipTier = catchAsync(async (req: Request, res: Response) => {
  const result = await membershipTierService.updateMembershipTier(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Membership tier updated successfully"));
});

export const deleteMembershipTier = catchAsync(async (req: Request, res: Response) => {
  await membershipTierService.deleteMembershipTier(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Membership tier deleted successfully"));
});
