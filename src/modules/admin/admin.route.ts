import { Router } from "express";

import { authMiddleware, authorizeRoles } from "@/middlewares/auth.middleware";
import { ROLES } from "@/constants";
import { getAdmin } from "@/modules/admin/admin.controller";
import { adminLoyaltyPointsRoute } from "@/modules/loyalty-points/loyalty-points.admin.route";
import { membershipTiersRoute } from "@/modules/membership-tiers/membership-tiers.route";
import { adminUserAddressesRoute } from "@/modules/user-addresses/user-addresses.admin.route";

export const adminRoute = Router();

adminRoute.use(authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN));

adminRoute.get("/", getAdmin);
adminRoute.use("/user-addresses", adminUserAddressesRoute);
adminRoute.use("/membership-tiers", membershipTiersRoute);
adminRoute.use("/loyalty-points", adminLoyaltyPointsRoute);
