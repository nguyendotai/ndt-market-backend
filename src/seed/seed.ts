import { connectMongoDB, disconnectMongoDB } from "@/configs/database";
import { logger } from "@/configs/logger";
import { ROLES } from "@/constants";
import { Types } from "mongoose";
import { ArticleCategoryModel, ArticleModel } from "@/modules/articles/articles.model";
import { BannerModel, BANNER_POSITIONS, BANNER_STATUSES } from "@/modules/banners/banners.model";
import { BrandModel } from "@/modules/brands/brands.model";
import { CartItemModel, CartModel } from "@/modules/carts/carts.model";
import { CategoryModel } from "@/modules/categories/categories.model";
import { CouponModel, CouponUsageModel } from "@/modules/coupons/coupons.model";
import {
  DeliveryTimeSlotModel,
  ShipmentModel,
  ShipperModel
} from "@/modules/delivery/delivery.model";
import { InventoryModel, StockMovementModel } from "@/modules/inventories/inventories.model";
import { LoyaltyPointModel } from "@/modules/loyalty-points/loyalty-points.model";
import {
  MEMBERSHIP_TIER_STATUSES,
  MembershipTierModel
} from "@/modules/membership-tiers/membership-tiers.model";
import {
  OrderItemModel,
  OrderModel,
  OrderStatusHistoryModel
} from "@/modules/orders/orders.model";
import { PaymentModel } from "@/modules/payments/payments.model";
import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES,
  ProductImageModel,
  ProductModel,
  ProductVariantModel
} from "@/modules/products/products.model";
import { DISCOUNT_TYPES, PROMOTION_STATUSES } from "@/modules/promotions/promotions.model";
import { ReviewModel } from "@/modules/reviews/reviews.model";
import { StoreModel, STORE_STATUSES } from "@/modules/stores/stores.model";
import { UserModel } from "@/modules/users/users.model";
import { WishlistModel } from "@/modules/wishlists/wishlists.model";
import { slugify } from "@/utils/slugify";

const imageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const clearData = async (): Promise<void> => {
  await Promise.all([
    ArticleModel.deleteMany({}),
    ArticleCategoryModel.deleteMany({}),
    BannerModel.deleteMany({}),
    BrandModel.deleteMany({}),
    CartItemModel.deleteMany({}),
    CartModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    CouponUsageModel.deleteMany({}),
    CouponModel.deleteMany({}),
    DeliveryTimeSlotModel.deleteMany({}),
    ShipmentModel.deleteMany({}),
    ShipperModel.deleteMany({}),
    InventoryModel.deleteMany({}),
    StockMovementModel.deleteMany({}),
    LoyaltyPointModel.deleteMany({}),
    MembershipTierModel.deleteMany({}),
    OrderItemModel.deleteMany({}),
    OrderStatusHistoryModel.deleteMany({}),
    OrderModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    ProductImageModel.deleteMany({}),
    ProductVariantModel.deleteMany({}),
    ProductModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    StoreModel.deleteMany({}),
    UserModel.deleteMany({}),
    WishlistModel.deleteMany({})
  ]);
};

const seedSuperAdmin = () =>
  UserModel.create({
    fullName: "Super Admin",
    phone: "0900000000",
    email: "admin@ndtmarket.com",
    password: "Admin@123",
    role: ROLES.SUPER_ADMIN,
    permissions: ["*"],
    membershipTier: "DIAMOND",
    totalPoints: 0
  });

const seedStores = () =>
  StoreModel.insertMany([
    {
      name: "NDT Market Quan 1",
      phone: "02811110001",
      province: "Ho Chi Minh",
      district: "Quan 1",
      ward: "Ben Nghe",
      address: "12 Le Loi",
      latitude: 10.7769,
      longitude: 106.7009,
      openingHours: "07:00-22:00",
      status: STORE_STATUSES.ACTIVE
    },
    {
      name: "NDT Market Quan 7",
      phone: "02811110002",
      province: "Ho Chi Minh",
      district: "Quan 7",
      ward: "Tan Phu",
      address: "45 Nguyen Luong Bang",
      latitude: 10.7292,
      longitude: 106.7217,
      openingHours: "07:00-22:00",
      status: STORE_STATUSES.ACTIVE
    },
    {
      name: "NDT Market Thu Duc",
      phone: "02811110003",
      province: "Ho Chi Minh",
      district: "Thu Duc",
      ward: "Linh Trung",
      address: "88 Vo Van Ngan",
      latitude: 10.8493,
      longitude: 106.7716,
      openingHours: "07:00-22:00",
      status: STORE_STATUSES.ACTIVE
    }
  ]);

const seedCategories = async () => {
  const parentNames = ["Rau cu", "Trai cay", "Thit ca", "Sua va trung", "Do kho"];
  const parents = await CategoryModel.insertMany(
    parentNames.map((name, index) => ({
      name,
      slug: slugify(name),
      image: imageUrl(`category-${index + 1}`),
      sortOrder: index + 1,
      isActive: true
    }))
  );

  const childNames = [
    { name: "Rau la", parent: parents[0]._id },
    { name: "Trai cay nhap khau", parent: parents[1]._id },
    { name: "Thit heo", parent: parents[2]._id },
    { name: "Sua tuoi", parent: parents[3]._id },
    { name: "Gia vi", parent: parents[4]._id }
  ];

  const children = await CategoryModel.insertMany(
    childNames.map((item, index) => ({
      name: item.name,
      slug: slugify(item.name),
      parent: item.parent,
      image: imageUrl(`category-child-${index + 1}`),
      sortOrder: index + 1,
      isActive: true
    }))
  );

  return [...parents, ...children];
};

const seedBrands = () => {
  const brandNames = [
    "NDT Fresh",
    "Vinamilk",
    "TH True Milk",
    "CP Foods",
    "Vissan",
    "Meizan",
    "Tuong An",
    "Orion",
    "Nestle",
    "Ajinomoto"
  ];

  return BrandModel.insertMany(
    brandNames.map((name, index) => ({
      name,
      slug: slugify(name),
      logo: imageUrl(`brand-${index + 1}`),
      description: `${name} official brand`,
      isActive: true
    }))
  );
};

const seedProducts = async (
  categories: Awaited<ReturnType<typeof seedCategories>>,
  brands: Awaited<ReturnType<typeof seedBrands>>,
  stores: Awaited<ReturnType<typeof seedStores>>
) => {
  const productNames = [
    "Rau muong",
    "Cai xanh",
    "Ca chua",
    "Khoai tay",
    "Ca rot",
    "Chuoi cau",
    "Tao Gala",
    "Cam sanh",
    "Nho do",
    "Dua hau",
    "Thit heo ba roi",
    "Thit heo xay",
    "Uc ga",
    "Canh ga",
    "Ca basa",
    "Tom su",
    "Trung ga",
    "Sua tuoi khong duong",
    "Sua chua",
    "Pho mai",
    "Gao thom",
    "Mi goi",
    "Nuoc mam",
    "Dau an",
    "Duong trang"
  ];
  const products: Array<{ _id: Types.ObjectId }> = [];
  const variants: Array<{ _id: Types.ObjectId }> = [];

  for (let index = 0; index < 50; index += 1) {
    const baseName = productNames[index % productNames.length];
    const name = `${baseName} ${index + 1}`;
    const product = await ProductModel.create({
      category: categories[index % categories.length]._id,
      brand: brands[index % brands.length]._id,
      name,
      slug: slugify(name),
      sku: `NDT-${String(index + 1).padStart(4, "0")}`,
      description: `${name} tuoi ngon, phu hop cho bua an gia dinh.`,
      shortDescription: `${name} chat luong cao.`,
      unit: "goi",
      origin: index % 2 === 0 ? "Viet Nam" : "Nhap khau",
      ingredients: ["Thanh phan tu nhien"],
      storageInstruction: "Bao quan noi kho mat",
      status: PRODUCT_STATUSES.ACTIVE,
      tags: [baseName.toLowerCase(), "sieu-thi", index % 2 === 0 ? "fresh" : "import"],
      soldCount: index * 3,
      ratingAverage: Number((3.8 + (index % 10) * 0.1).toFixed(1)),
      ratingCount: 5 + index
    });
    products.push(product);

    await ProductImageModel.create({
      product: product._id,
      imageUrl: imageUrl(`product-${index + 1}`),
      isThumbnail: true,
      sortOrder: 1
    });

    const variantCount = (index % 3) + 1;

    for (let variantIndex = 0; variantIndex < variantCount; variantIndex += 1) {
      const price = 15000 + index * 1200 + variantIndex * 5000;
      const variant = await ProductVariantModel.create({
        product: product._id,
        name: variantIndex === 0 ? "Mac dinh" : `${variantIndex + 1} goi`,
        barcode: `893${String(index + 1).padStart(5, "0")}${variantIndex}`,
        price,
        salePrice: variantIndex === 0 && index % 4 === 0 ? price - 2000 : undefined,
        weight: 500 + variantIndex * 250,
        unit: "g",
        status: PRODUCT_VARIANT_STATUSES.ACTIVE
      });
      variants.push(variant);
    }
  }

  await InventoryModel.insertMany(
    stores.flatMap((store, storeIndex) =>
      variants.map((variant, variantIndex) => ({
        store: store._id,
        variant: variant._id,
        quantity: 40 + ((variantIndex + storeIndex) % 30),
        reservedQuantity: 0
      }))
    )
  );

  return { products, variants };
};

const seedBanners = () => {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return BannerModel.insertMany(
    Array.from({ length: 5 }, (_item, index) => ({
      title: `Banner khuyen mai ${index + 1}`,
      imageUrl: imageUrl(`banner-${index + 1}`),
      linkUrl: `https://ndtmarket.local/promo-${index + 1}`,
      position: Object.values(BANNER_POSITIONS)[index % Object.values(BANNER_POSITIONS).length],
      startDate: now,
      endDate: nextMonth,
      status: BANNER_STATUSES.ACTIVE,
      sortOrder: index + 1
    }))
  );
};

const seedCoupons = () => {
  const expiredAt = new Date();
  expiredAt.setMonth(expiredAt.getMonth() + 2);

  return CouponModel.insertMany([
    {
      code: "WELCOME10",
      discountType: DISCOUNT_TYPES.PERCENT,
      discountValue: 10,
      minOrderValue: 100000,
      maxDiscount: 30000,
      usageLimit: 1000,
      userLimit: 1,
      expiredAt,
      status: PROMOTION_STATUSES.ACTIVE
    },
    {
      code: "FREESHIP",
      discountType: DISCOUNT_TYPES.FIXED,
      discountValue: 20000,
      minOrderValue: 150000,
      maxDiscount: 20000,
      usageLimit: 800,
      userLimit: 2,
      expiredAt,
      status: PROMOTION_STATUSES.ACTIVE
    },
    {
      code: "FRESH15",
      discountType: DISCOUNT_TYPES.PERCENT,
      discountValue: 15,
      minOrderValue: 200000,
      maxDiscount: 50000,
      usageLimit: 500,
      userLimit: 1,
      expiredAt,
      status: PROMOTION_STATUSES.ACTIVE
    },
    {
      code: "NDT50000",
      discountType: DISCOUNT_TYPES.FIXED,
      discountValue: 50000,
      minOrderValue: 400000,
      maxDiscount: 50000,
      usageLimit: 300,
      userLimit: 1,
      expiredAt,
      status: PROMOTION_STATUSES.ACTIVE
    },
    {
      code: "VIP20",
      discountType: DISCOUNT_TYPES.PERCENT,
      discountValue: 20,
      minOrderValue: 500000,
      maxDiscount: 100000,
      usageLimit: 200,
      userLimit: 1,
      expiredAt,
      status: PROMOTION_STATUSES.ACTIVE
    }
  ]);
};

const seedMembershipTiers = () =>
  MembershipTierModel.insertMany([
    {
      name: "BRONZE",
      minPoint: 0,
      discountPercent: 0,
      benefits: ["Tich diem moi don hang"],
      status: MEMBERSHIP_TIER_STATUSES.ACTIVE
    },
    {
      name: "SILVER",
      minPoint: 1000,
      discountPercent: 3,
      benefits: ["Giam 3%", "Uu dai sinh nhat"],
      status: MEMBERSHIP_TIER_STATUSES.ACTIVE
    },
    {
      name: "GOLD",
      minPoint: 5000,
      discountPercent: 5,
      benefits: ["Giam 5%", "Uu tien giao hang"],
      status: MEMBERSHIP_TIER_STATUSES.ACTIVE
    }
  ]);

const runSeed = async (): Promise<void> => {
  await connectMongoDB();
  logger.info("Clearing old seed data...");
  await clearData();

  logger.info("Creating seed data...");
  await seedSuperAdmin();
  const stores = await seedStores();
  const categories = await seedCategories();
  const brands = await seedBrands();
  await seedProducts(categories, brands, stores);
  await seedBanners();
  await seedCoupons();
  await seedMembershipTiers();

  logger.info("Seed completed. Super admin: admin@ndtmarket.com / Admin@123");
  await disconnectMongoDB();
};

void runSeed().catch(async (error) => {
  logger.error("Seed failed", error);
  await disconnectMongoDB();
  process.exit(1);
});
