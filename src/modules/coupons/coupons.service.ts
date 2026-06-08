import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  Coupon,
  CouponModel,
  CouponUsageModel
} from "@/modules/coupons/coupons.model";
import {
  ApplyCouponInput,
  CreateCouponInput,
  UpdateCouponInput
} from "@/modules/coupons/coupons.validation";
import { DISCOUNT_TYPES, PROMOTION_STATUSES } from "@/modules/promotions/promotions.model";
import { ApiError } from "@/utils/ApiError";

const normalizeCode = (code: string) => code.trim().toUpperCase();

const calculateDiscountAmount = (coupon: Coupon, orderValue: number) => {
  const rawDiscount =
    coupon.discountType === DISCOUNT_TYPES.PERCENT
      ? (orderValue * coupon.discountValue) / 100
      : coupon.discountValue;

  return Math.min(rawDiscount, coupon.maxDiscount ?? rawDiscount, orderValue);
};

export const applyCoupon = async (
  userId: string | Types.ObjectId,
  payload: ApplyCouponInput
) => {
  const coupon = await CouponModel.findOne({ code: normalizeCode(payload.code) });

  if (!coupon || coupon.status !== PROMOTION_STATUSES.ACTIVE) {
    throw new ApiError("Coupon is not available", HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.expiredAt < new Date()) {
    throw new ApiError("Coupon has expired", HTTP_STATUS.BAD_REQUEST);
  }

  if (payload.orderValue < coupon.minOrderValue) {
    throw new ApiError("Order value does not meet coupon minimum", HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError("Coupon usage limit has been reached", HTTP_STATUS.BAD_REQUEST);
  }

  const userUsedCount = await CouponUsageModel.countDocuments({
    coupon: coupon._id,
    user: userId
  });

  if (userUsedCount >= coupon.userLimit) {
    throw new ApiError("Coupon user limit has been reached", HTTP_STATUS.BAD_REQUEST);
  }

  const discountAmount = calculateDiscountAmount(coupon, payload.orderValue);

  return {
    coupon,
    discountAmount
  };
};

export const getCoupons = () => CouponModel.find().sort({ createdAt: -1 });

export const createCoupon = async (payload: CreateCouponInput) => {
  const code = normalizeCode(payload.code);
  const existingCoupon = await CouponModel.findOne({ code });

  if (existingCoupon) {
    throw new ApiError("Coupon code already exists", HTTP_STATUS.CONFLICT);
  }

  return CouponModel.create({
    ...payload,
    code
  });
};

export const updateCoupon = async (id: string, payload: UpdateCouponInput) => {
  const updatePayload = {
    ...payload,
    ...(payload.code ? { code: normalizeCode(payload.code) } : {})
  };

  const coupon = await CouponModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (!coupon) {
    throw new ApiError("Coupon not found", HTTP_STATUS.NOT_FOUND);
  }

  return coupon;
};

export const deleteCoupon = async (id: string) => {
  const coupon = await CouponModel.findByIdAndDelete(id);

  if (!coupon) {
    throw new ApiError("Coupon not found", HTTP_STATUS.NOT_FOUND);
  }

  return coupon;
};
