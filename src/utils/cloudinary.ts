import { cloudinary } from "@/configs/cloudinary";
import { logger } from "@/configs/logger";

const getCloudinaryPublicId = (imageUrl?: string | null): string | null => {
  if (!imageUrl) {
    return null;
  }

  try {
    const url = new URL(imageUrl);

    if (!url.hostname.includes("cloudinary.com")) {
      return null;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const uploadIndex = pathParts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    const uploadParts = pathParts.slice(uploadIndex + 1);
    const versionIndex = uploadParts.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = versionIndex >= 0 ? uploadParts.slice(versionIndex + 1) : uploadParts;

    if (publicIdParts.length === 0) {
      return null;
    }

    const publicIdWithExtension = decodeURIComponent(publicIdParts.join("/"));

    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

export const deleteCloudinaryImage = async (imageUrl?: string | null): Promise<void> => {
  const publicId = getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });
  } catch (error) {
    logger.warn("Failed to delete Cloudinary image", { publicId, error });
  }
};

export const deleteCloudinaryImages = async (
  imageUrls: Array<string | null | undefined>
): Promise<void> => {
  await Promise.all(imageUrls.map((imageUrl) => deleteCloudinaryImage(imageUrl)));
};
