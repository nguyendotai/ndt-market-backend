import { HTTP_STATUS } from "@/constants";
import { BrandModel } from "@/modules/brands/brands.model";
import { CreateBrandInput, UpdateBrandInput } from "@/modules/brands/brands.validation";
import { ApiError } from "@/utils/ApiError";
import { deleteCloudinaryImage } from "@/utils/cloudinary";
import { slugify } from "@/utils/slugify";

const ensureUniqueSlug = async (name: string, excludeId?: string) => {
  const slug = slugify(name);
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  const existingBrand = await BrandModel.findOne(query);

  if (existingBrand) {
    throw new ApiError("Brand slug already exists", HTTP_STATUS.CONFLICT);
  }

  return slug;
};

export const getPublicBrands = () =>
  BrandModel.find({ isActive: true }).sort({ name: 1 });

export const getPublicBrandBySlug = async (slug: string) => {
  const brand = await BrandModel.findOne({ slug, isActive: true });

  if (!brand) {
    throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
  }

  return brand;
};

export const createBrand = async (payload: CreateBrandInput) => {
  const slug = await ensureUniqueSlug(payload.name);

  return BrandModel.create({
    ...payload,
    slug
  });
};

export const updateBrand = async (id: string, payload: UpdateBrandInput) => {
  const currentBrand = await BrandModel.findById(id);

  if (!currentBrand) {
    throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload = {
    ...payload,
    ...(payload.name ? { slug: await ensureUniqueSlug(payload.name, id) } : {})
  };

  const brand = await BrandModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (payload.logo && payload.logo !== currentBrand.logo) {
    await deleteCloudinaryImage(currentBrand.logo);
  }

  return brand;
};

export const deleteBrand = async (id: string) => {
  const brand = await BrandModel.findByIdAndDelete(id);

  if (!brand) {
    throw new ApiError("Brand not found", HTTP_STATUS.NOT_FOUND);
  }

  await deleteCloudinaryImage(brand.logo);

  return brand;
};
