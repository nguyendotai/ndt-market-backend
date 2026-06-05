import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  LOYALTY_POINT_TYPES,
  LoyaltyPointModel,
  LoyaltyPointType
} from "@/modules/loyalty-points/loyalty-points.model";
import { AdjustLoyaltyPointInput } from "@/modules/loyalty-points/loyalty-points.validation";
import { UserModel } from "@/modules/users/users.model";
import { ApiError } from "@/utils/ApiError";

type LoyaltyPointQuery = {
  user?: string;
  type?: LoyaltyPointType;
};

export const getMyLoyaltyPoints = (userId: string | Types.ObjectId) =>
  LoyaltyPointModel.find({ user: userId }).sort({ createdAt: -1 });

export const getAllLoyaltyPoints = (query: LoyaltyPointQuery) =>
  LoyaltyPointModel.find(query).sort({ createdAt: -1 });

export const adjustLoyaltyPoints = async (payload: AdjustLoyaltyPointInput) => {
  const user = await UserModel.findById(payload.user);

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const nextPoints = user.totalPoints + payload.points;

  if (nextPoints < 0) {
    throw new ApiError("User points cannot be negative", HTTP_STATUS.BAD_REQUEST);
  }

  const loyaltyPoint = await LoyaltyPointModel.create({
    user: payload.user,
    order: payload.order,
    points: payload.points,
    type: payload.type ?? LOYALTY_POINT_TYPES.ADJUST,
    note: payload.note
  });

  user.totalPoints = nextPoints;
  await user.save();

  return loyaltyPoint;
};
