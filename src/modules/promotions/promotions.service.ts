import { HTTP_STATUS } from "@/constants";
import {
  CreatePromotionInput,
  UpdatePromotionInput
} from "@/modules/promotions/promotions.validation";
import {
  PROMOTION_STATUSES,
  PromotionModel,
  PromotionProductModel
} from "@/modules/promotions/promotions.model";
import { ApiError } from "@/utils/ApiError";

const syncPromotionProducts = async (promotionId: string, variants?: string[]) => {
  if (!variants) {
    return;
  }

  await PromotionProductModel.deleteMany({ promotion: promotionId });

  if (variants.length > 0) {
    await PromotionProductModel.insertMany(
      variants.map((variant) => ({
        promotion: promotionId,
        variant
      }))
    );
  }
};

const getPromotionWithProducts = async (promotionId: string) => {
  const promotion = await PromotionModel.findById(promotionId).lean();

  if (!promotion) {
    throw new ApiError("Promotion not found", HTTP_STATUS.NOT_FOUND);
  }

  const products = await PromotionProductModel.find({ promotion: promotionId })
    .populate("variant")
    .lean();

  return {
    ...promotion,
    products
  };
};

export const getPublicPromotions = async () => {
  const now = new Date();
  const promotions = await PromotionModel.find({
    status: PROMOTION_STATUSES.ACTIVE,
    startDate: { $lte: now },
    endDate: { $gte: now }
  })
    .sort({ startDate: -1 })
    .lean();

  const promotionProducts = await PromotionProductModel.find({
    promotion: { $in: promotions.map((promotion) => promotion._id) }
  })
    .populate("variant")
    .lean();

  return promotions.map((promotion) => ({
    ...promotion,
    products: promotionProducts.filter(
      (item) => String(item.promotion) === String(promotion._id)
    )
  }));
};

export const createPromotion = async (payload: CreatePromotionInput) => {
  const promotion = await PromotionModel.create(payload);

  await syncPromotionProducts(String(promotion._id), payload.variants);

  return getPromotionWithProducts(String(promotion._id));
};

export const updatePromotion = async (id: string, payload: UpdatePromotionInput) => {
  const promotion = await PromotionModel.findByIdAndUpdate(id, payload, { new: true });

  if (!promotion) {
    throw new ApiError("Promotion not found", HTTP_STATUS.NOT_FOUND);
  }

  await syncPromotionProducts(id, payload.variants);

  return getPromotionWithProducts(id);
};

export const deletePromotion = async (id: string) => {
  const promotion = await PromotionModel.findByIdAndDelete(id);

  if (!promotion) {
    throw new ApiError("Promotion not found", HTTP_STATUS.NOT_FOUND);
  }

  await PromotionProductModel.deleteMany({ promotion: id });

  return promotion;
};
