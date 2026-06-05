import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import * as membershipTierController from "@/modules/membership-tiers/membership-tiers.controller";
import {
  createMembershipTierSchema,
  membershipTierIdSchema,
  updateMembershipTierSchema
} from "@/modules/membership-tiers/membership-tiers.validation";

export const membershipTiersRoute = Router();

membershipTiersRoute.get("/", membershipTierController.getMembershipTiers);
membershipTiersRoute.get(
  "/:id",
  validate(membershipTierIdSchema),
  membershipTierController.getMembershipTierById
);
membershipTiersRoute.post(
  "/",
  validate(createMembershipTierSchema),
  membershipTierController.createMembershipTier
);
membershipTiersRoute.patch(
  "/:id",
  validate(updateMembershipTierSchema),
  membershipTierController.updateMembershipTier
);
membershipTiersRoute.delete(
  "/:id",
  validate(membershipTierIdSchema),
  membershipTierController.deleteMembershipTier
);
