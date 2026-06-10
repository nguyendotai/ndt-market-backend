import { HTTP_STATUS } from "@/constants";
import { BannerModel, BANNER_STATUSES } from "@/modules/banners/banners.model";
import { CreateBannerInput, UpdateBannerInput } from "@/modules/banners/banners.validation";
import { ApiError } from "@/utils/ApiError";
import { deleteCloudinaryImage } from "@/utils/cloudinary";

export const getPublicBanners = () => {
  const now = new Date();

  return BannerModel.find({
    status: BANNER_STATUSES.ACTIVE,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ sortOrder: 1, createdAt: -1 });
};

export const createBanner = (payload: CreateBannerInput) => BannerModel.create(payload);

export const updateBanner = async (id: string, payload: UpdateBannerInput) => {
  const currentBanner = await BannerModel.findById(id);

  if (!currentBanner) {
    throw new ApiError("Banner not found", HTTP_STATUS.NOT_FOUND);
  }

  const banner = await BannerModel.findByIdAndUpdate(id, payload, { new: true });

  if (payload.imageUrl && payload.imageUrl !== currentBanner.imageUrl) {
    await deleteCloudinaryImage(currentBanner.imageUrl);
  }

  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await BannerModel.findByIdAndDelete(id);

  if (!banner) {
    throw new ApiError("Banner not found", HTTP_STATUS.NOT_FOUND);
  }

  await deleteCloudinaryImage(banner.imageUrl);

  return banner;
};
