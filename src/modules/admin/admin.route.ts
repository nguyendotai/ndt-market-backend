import { Router } from "express";

import {
  authMiddleware,
  authorizePermissions,
  authorizeRoles
} from "@/middlewares/auth.middleware";
import { ROLES } from "@/constants";
import { getAdmin } from "@/modules/admin/admin.controller";
import { adminRbacRoute } from "@/modules/admin/rbac.route";
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
import { adminUsersRoute } from "@/modules/users/users.admin.route";

export const adminRoute = Router();

adminRoute.use(authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.STAFF, ROLES.SUPER_ADMIN));

adminRoute.get("/", getAdmin);
adminRoute.use("/", authorizeRoles(ROLES.SUPER_ADMIN), adminRbacRoute);
adminRoute.use("/users", authorizePermissions("customers.manage"), adminUsersRoute);
adminRoute.use("/user-addresses", authorizePermissions("customers.manage"), adminUserAddressesRoute);
adminRoute.use("/membership-tiers", authorizePermissions("customers.manage"), membershipTiersRoute);
adminRoute.use("/loyalty-points", authorizePermissions("customers.manage"), adminLoyaltyPointsRoute);
adminRoute.use("/categories", authorizePermissions("catalog.manage"), adminCategoriesRoute);
adminRoute.use("/brands", authorizePermissions("catalog.manage"), adminBrandsRoute);
adminRoute.use("/banners", authorizePermissions("cms.manage"), adminBannersRoute);
adminRoute.use("/article-categories", authorizePermissions("cms.manage"), adminArticleCategoriesRoute);
adminRoute.use("/articles", authorizePermissions("cms.manage"), adminArticlesRoute);
adminRoute.use("/products", authorizePermissions("catalog.manage"), adminProductsRoute);
adminRoute.use("/promotions", authorizePermissions("marketing.manage"), adminPromotionsRoute);
adminRoute.use("/coupons", authorizePermissions("marketing.manage"), adminCouponsRoute);
adminRoute.use("/reviews", authorizePermissions("reviews.manage"), adminReviewsRoute);
adminRoute.use("/stores", authorizePermissions("stores.manage"), adminStoresRoute);
adminRoute.use("/inventories", authorizePermissions("inventory.manage"), adminInventoriesRoute);
adminRoute.use("/orders", authorizePermissions("orders.manage"), adminOrdersRoute);
adminRoute.use("/payments", authorizePermissions("payments.manage"), adminPaymentsRoute);
adminRoute.use("/delivery", authorizePermissions("delivery.manage"), adminDeliveryRoute);
adminRoute.use("/shipments", authorizePermissions("delivery.manage"), adminShipmentsRoute);
