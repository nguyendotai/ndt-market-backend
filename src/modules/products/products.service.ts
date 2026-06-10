import { FilterQuery, Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import { BrandModel } from "@/modules/brands/brands.model";
import { CategoryModel } from "@/modules/categories/categories.model";
import { InventoryModel } from "@/modules/inventories/inventories.model";
import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES,
  Product,
  ProductImageModel,
  ProductModel,
  ProductVariantModel
} from "@/modules/products/products.model";
import {
  CreateProductImageInput,
  CreateProductInput,
  CreateProductVariantInput,
  ProductListQuery,
  UpdateProductInput,
  UpdateProductVariantInput
} from "@/modules/products/products.validation";
import { ApiError } from "@/utils/ApiError";
import { deleteCloudinaryImage, deleteCloudinaryImages } from "@/utils/cloudinary";
import { slugify } from "@/utils/slugify";

type ProductDocumentLike = Product & {
  toObject(): Product;
};

type ProductWithRelations = Product & {
  variants: unknown[];
  images: unknown[];
};

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const getSortOption = (sort: ProductListQuery["sort"]) => {
  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { createdAt: -1 },
    price_desc: { createdAt: -1 },
    best_selling: { soldCount: -1 },
    rating: { ratingAverage: -1, ratingCount: -1 },
    sold_desc: { soldCount: -1 },
    rating_desc: { ratingAverage: -1, ratingCount: -1 }
  } as const;

  return sortOptions[sort];
};

const resolveCategoryId = async (value?: string) => {
  if (!value) {
    return undefined;
  }

  if (objectIdRegex.test(value)) {
    return new Types.ObjectId(value);
  }

  const category = await CategoryModel.findOne({ slug: value });

  return category?._id;
};

const resolveBrandId = async (value?: string) => {
  if (!value) {
    return undefined;
  }

  if (objectIdRegex.test(value)) {
    return new Types.ObjectId(value);
  }

  const brand = await BrandModel.findOne({ slug: value });

  return brand?._id;
};

const ensureUniqueSlug = async (name: string, excludeId?: string) => {
  const slug = slugify(name);
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  const existingProduct = await ProductModel.findOne(query);

  if (existingProduct) {
    throw new ApiError("Product slug already exists", HTTP_STATUS.CONFLICT);
  }

  return slug;
};

const ensureUniqueSku = async (sku: string, excludeId?: string) => {
  const normalizedSku = sku.trim().toUpperCase();
  const query = excludeId ? { sku: normalizedSku, _id: { $ne: excludeId } } : { sku: normalizedSku };
  const existingProduct = await ProductModel.findOne(query);

  if (existingProduct) {
    throw new ApiError("Product SKU already exists", HTTP_STATUS.CONFLICT);
  }

  return normalizedSku;
};

const generateUniqueSku = async (name: string) => {
  const baseSku = slugify(name).replace(/-/g, "").toUpperCase().slice(0, 12) || "PRODUCT";

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const suffix = `${Date.now().toString(36)}${attempt}`.toUpperCase();
    const sku = `NDT-${baseSku}-${suffix}`;
    const existingProduct = await ProductModel.findOne({ sku });

    if (!existingProduct) {
      return sku;
    }
  }

  throw new ApiError("Cannot generate product SKU", HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

const ensureUniqueBarcode = async (barcode: string, excludeId?: string) => {
  const normalizedBarcode = barcode.trim();
  const query = excludeId
    ? { barcode: normalizedBarcode, _id: { $ne: excludeId } }
    : { barcode: normalizedBarcode };
  const existingVariant = await ProductVariantModel.findOne(query);

  if (existingVariant) {
    throw new ApiError("Product variant barcode already exists", HTTP_STATUS.CONFLICT);
  }

  return normalizedBarcode;
};

const generateUniqueBarcode = async () => {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const timestampPart = Date.now().toString().slice(-9);
    const randomPart = Math.floor(100 + Math.random() * 900).toString();
    const barcode = `893${timestampPart}${randomPart}${attempt}`;
    const existingVariant = await ProductVariantModel.findOne({ barcode });

    if (!existingVariant) {
      return barcode;
    }
  }

  throw new ApiError("Cannot generate product variant barcode", HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

const getProductIdsByPrice = async (minPrice?: number, maxPrice?: number) => {
  if (minPrice === undefined && maxPrice === undefined) {
    return undefined;
  }

  const effectivePrice = { $ifNull: ["$salePrice", "$price"] };
  const priceExpressions = [
    ...(minPrice !== undefined ? [{ $gte: [effectivePrice, minPrice] }] : []),
    ...(maxPrice !== undefined ? [{ $lte: [effectivePrice, maxPrice] }] : [])
  ];

  const variants = await ProductVariantModel.find({
    status: PRODUCT_VARIANT_STATUSES.ACTIVE,
    $expr: {
      $and: priceExpressions
    }
  }).select("product");

  return variants.map((variant) => variant.product);
};

const getProductIdsByStock = async (storeId?: string) => {
  const inventories = await InventoryModel.find({
    ...(storeId ? { store: storeId } : {}),
    $expr: {
      $gt: [{ $subtract: ["$quantity", "$reservedQuantity"] }, 0]
    }
  }).select("variant");

  if (inventories.length === 0) {
    return [];
  }

  const variants = await ProductVariantModel.find({
    _id: { $in: inventories.map((inventory) => inventory.variant) },
    status: PRODUCT_VARIANT_STATUSES.ACTIVE
  }).select("product");

  return variants.map((variant) => variant.product);
};

const intersectProductIds = (
  firstIds: Types.ObjectId[] | undefined,
  secondIds: Types.ObjectId[]
) => {
  if (!firstIds) {
    return secondIds;
  }

  const secondIdSet = new Set(secondIds.map((id) => String(id)));

  return firstIds.filter((id) => secondIdSet.has(String(id)));
};

const attachRelations = async (products: ProductDocumentLike[]) => {
  const productIds = products.map((product) => product._id);
  const [variants, images] = await Promise.all([
    ProductVariantModel.find({ product: { $in: productIds } }).sort({ price: 1 }).lean(),
    ProductImageModel.find({ product: { $in: productIds } }).sort({ isThumbnail: -1, sortOrder: 1 }).lean()
  ]);

  return products.map((product) => {
    const productObject = product.toObject();
    const productId = String(productObject._id);

    return {
      ...productObject,
      variants: variants.filter((variant) => String(variant.product) === productId),
      images: images.filter((image) => String(image.product) === productId)
    } as ProductWithRelations;
  });
};

const getProductByIdOrFail = async (id: string) => {
  const product = await ProductModel.findById(id);

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

export const getPublicProducts = async (query: ProductListQuery) => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const productQuery: FilterQuery<Product> = {
    status: PRODUCT_STATUSES.ACTIVE
  };

  if (query.keyword) {
    const keywordRegex = new RegExp(query.keyword, "i");
    productQuery.$or = [{ name: keywordRegex }, { sku: keywordRegex }, { description: keywordRegex }];
  }

  if (query.origin) {
    productQuery.origin = new RegExp(query.origin, "i");
  }

  if (query.tags && query.tags.length > 0) {
    productQuery.tags = { $in: query.tags };
  }

  if (query.rating !== undefined) {
    productQuery.ratingAverage = { $gte: query.rating };
  }

  const categoryId = await resolveCategoryId(query.category);
  const brandId = await resolveBrandId(query.brand);

  if (query.category && !categoryId) {
    return { products: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }

  if (query.brand && !brandId) {
    return { products: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }

  if (categoryId) {
    productQuery.category = categoryId;
  }

  if (brandId) {
    productQuery.brand = brandId;
  }

  const priceProductIds = await getProductIdsByPrice(query.minPrice, query.maxPrice);
  const stockProductIds =
    query.storeId || query.inStock ? await getProductIdsByStock(query.storeId) : undefined;
  const filteredProductIds =
    stockProductIds !== undefined
      ? intersectProductIds(priceProductIds, stockProductIds)
      : priceProductIds;

  if (filteredProductIds) {
    productQuery._id = { $in: filteredProductIds };
  }

  const shouldSortByPrice = query.sort === "price_asc" || query.sort === "price_desc";
  const [total, products] = await Promise.all([
    ProductModel.countDocuments(productQuery),
    shouldSortByPrice
      ? ProductModel.find(productQuery).populate("category").populate("brand")
      : ProductModel.find(productQuery)
          .populate("category")
          .populate("brand")
          .sort(getSortOption(query.sort))
          .skip(skip)
          .limit(limit)
  ]);

  let productsWithRelations = await attachRelations(products);

  if (shouldSortByPrice) {
    productsWithRelations = productsWithRelations.sort((first, second) => {
      const firstPrice = getLowestProductPrice(first.variants);
      const secondPrice = getLowestProductPrice(second.variants);

      return query.sort === "price_asc" ? firstPrice - secondPrice : secondPrice - firstPrice;
    }).slice(skip, skip + limit);
  }

  return {
    products: productsWithRelations,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getLowestProductPrice = (variants: unknown[]) => {
  const prices = variants.map((variant) => {
    const item = variant as { price: number; salePrice?: number };

    return item.salePrice ?? item.price;
  });

  return prices.length > 0 ? Math.min(...prices) : Number.MAX_SAFE_INTEGER;
};

export const getPublicProductBySlug = async (slug: string) => {
  const product = await ProductModel.findOne({ slug, status: PRODUCT_STATUSES.ACTIVE })
    .populate("category")
    .populate("brand");

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  const [productWithRelations] = await attachRelations([product]);

  return productWithRelations;
};

export const getRelatedProducts = async (slug: string) => {
  const product = await ProductModel.findOne({ slug, status: PRODUCT_STATUSES.ACTIVE });

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  const relatedProducts = await ProductModel.find({
    _id: { $ne: product._id },
    category: product.category,
    status: PRODUCT_STATUSES.ACTIVE
  })
    .populate("category")
    .populate("brand")
    .sort({ soldCount: -1, ratingAverage: -1 })
    .limit(8);

  return attachRelations(relatedProducts);
};

export const createProduct = async (payload: CreateProductInput) => {
  const [slug, sku] = await Promise.all([
    ensureUniqueSlug(payload.name),
    payload.sku ? ensureUniqueSku(payload.sku) : generateUniqueSku(payload.name)
  ]);

  return ProductModel.create({
    ...payload,
    brand: payload.brand ? new Types.ObjectId(payload.brand) : null,
    slug,
    sku
  });
};

export const updateProduct = async (id: string, payload: UpdateProductInput) => {
  const updatePayload = {
    ...payload,
    ...(payload.name ? { slug: await ensureUniqueSlug(payload.name, id) } : {}),
    ...(payload.sku ? { sku: await ensureUniqueSku(payload.sku, id) } : {}),
    ...(payload.brand !== undefined
      ? { brand: payload.brand ? new Types.ObjectId(payload.brand) : null }
      : {})
  };

  const product = await ProductModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const [variants, images] = await Promise.all([
    ProductVariantModel.find({ product: id }).select("imageUrl"),
    ProductImageModel.find({ product: id }).select("imageUrl")
  ]);
  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  await Promise.all([
    ProductVariantModel.deleteMany({ product: id }),
    ProductImageModel.deleteMany({ product: id })
  ]);
  await deleteCloudinaryImages([
    ...variants.map((variant) => variant.imageUrl),
    ...images.map((image) => image.imageUrl)
  ]);

  return product;
};

export const createProductVariant = async (
  productId: string,
  payload: CreateProductVariantInput
) => {
  await getProductByIdOrFail(productId);
  const barcode = payload.barcode
    ? await ensureUniqueBarcode(payload.barcode)
    : await generateUniqueBarcode();

  return ProductVariantModel.create({
    ...payload,
    barcode,
    product: productId
  });
};

export const updateProductVariant = async (
  variantId: string,
  payload: UpdateProductVariantInput
) => {
  const currentVariant = await ProductVariantModel.findById(variantId);

  if (!currentVariant) {
    throw new ApiError("Product variant not found", HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload = {
    ...payload,
    ...(payload.barcode ? { barcode: await ensureUniqueBarcode(payload.barcode, variantId) } : {})
  };
  const variant = await ProductVariantModel.findByIdAndUpdate(variantId, updatePayload, { new: true });

  if (payload.imageUrl && payload.imageUrl !== currentVariant.imageUrl) {
    await deleteCloudinaryImage(currentVariant.imageUrl);
  }

  return variant;
};

export const deleteProductVariant = async (variantId: string) => {
  const variant = await ProductVariantModel.findByIdAndDelete(variantId);

  if (!variant) {
    throw new ApiError("Product variant not found", HTTP_STATUS.NOT_FOUND);
  }

  await deleteCloudinaryImage(variant.imageUrl);

  return variant;
};

export const createProductImage = async (productId: string, payload: CreateProductImageInput) => {
  await getProductByIdOrFail(productId);

  if (payload.isThumbnail) {
    await ProductImageModel.updateMany({ product: productId }, { isThumbnail: false });
  }

  return ProductImageModel.create({
    ...payload,
    product: productId
  });
};

export const deleteProductImage = async (imageId: string) => {
  const image = await ProductImageModel.findByIdAndDelete(imageId);

  if (!image) {
    throw new ApiError("Product image not found", HTTP_STATUS.NOT_FOUND);
  }

  await deleteCloudinaryImage(image.imageUrl);

  return image;
};
