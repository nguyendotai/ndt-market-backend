import { Router } from "express";

import { authMiddleware, authorizeRoles } from "@/middlewares/auth.middleware";
import { ROLES } from "@/constants";
import { getAdmin } from "@/modules/admin/admin.controller";
import {
  adminArticleCategoriesRoute,
  adminArticlesRoute
} from "@/modules/articles/articles.admin.route";
import { adminBannersRoute } from "@/modules/banners/banners.admin.route";
import { adminBrandsRoute } from "@/modules/brands/brands.admin.route";
import { adminCategoriesRoute } from "@/modules/categories/categories.admin.route";
import { adminCouponsRoute } from "@/modules/coupons/coupons.admin.route";
import {
  adminDeliveryRoute,
  adminShipmentsRoute
} from "@/modules/delivery/delivery.admin.route";
import { adminInventoriesRoute } from "@/modules/inventories/inventories.admin.route";
import { adminLoyaltyPointsRoute } from "@/modules/loyalty-points/loyalty-points.admin.route";
import { membershipTiersRoute } from "@/modules/membership-tiers/membership-tiers.route";
import { adminOrdersRoute } from "@/modules/orders/orders.admin.route";
import { adminPaymentsRoute } from "@/modules/payments/payments.admin.route";
import { adminProductsRoute } from "@/modules/products/products.admin.route";
import { adminPromotionsRoute } from "@/modules/promotions/promotions.admin.route";
import { adminReviewsRoute } from "@/modules/reviews/reviews.admin.route";
import { adminStoresRoute } from "@/modules/stores/stores.admin.route";
import { adminUserAddressesRoute } from "@/modules/user-addresses/user-addresses.admin.route";

export const adminRoute = Router();

adminRoute.use(authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN));

adminRoute.get("/", getAdmin);
adminRoute.use("/user-addresses", adminUserAddressesRoute);
adminRoute.use("/membership-tiers", membershipTiersRoute);
adminRoute.use("/loyalty-points", adminLoyaltyPointsRoute);
adminRoute.use("/categories", adminCategoriesRoute);
adminRoute.use("/brands", adminBrandsRoute);
adminRoute.use("/banners", adminBannersRoute);
adminRoute.use("/article-categories", adminArticleCategoriesRoute);
adminRoute.use("/articles", adminArticlesRoute);
adminRoute.use("/products", adminProductsRoute);
adminRoute.use("/promotions", adminPromotionsRoute);
adminRoute.use("/coupons", adminCouponsRoute);
adminRoute.use("/reviews", adminReviewsRoute);
adminRoute.use("/stores", adminStoresRoute);
adminRoute.use("/inventories", adminInventoriesRoute);
adminRoute.use("/orders", adminOrdersRoute);
adminRoute.use("/payments", adminPaymentsRoute);
adminRoute.use("/delivery", adminDeliveryRoute);
adminRoute.use("/shipments", adminShipmentsRoute);
