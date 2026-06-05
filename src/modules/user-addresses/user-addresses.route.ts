import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as userAddressController from "@/modules/user-addresses/user-addresses.controller";
import {
  createUserAddressSchema,
  updateUserAddressSchema,
  userAddressIdSchema
} from "@/modules/user-addresses/user-addresses.validation";

export const userAddressesRoute = Router();

userAddressesRoute.use(authMiddleware);
userAddressesRoute.get("/", userAddressController.getMyAddresses);
userAddressesRoute.post("/", validate(createUserAddressSchema), userAddressController.createMyAddress);
userAddressesRoute.patch(
  "/:id",
  validate(updateUserAddressSchema),
  userAddressController.updateMyAddress
);
userAddressesRoute.delete(
  "/:id",
  validate(userAddressIdSchema),
  userAddressController.deleteMyAddress
);
userAddressesRoute.patch(
  "/:id/default",
  validate(userAddressIdSchema),
  userAddressController.setMyDefaultAddress
);
