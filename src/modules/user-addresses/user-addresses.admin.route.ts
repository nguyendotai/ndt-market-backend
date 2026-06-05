import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import * as userAddressController from "@/modules/user-addresses/user-addresses.controller";
import {
  adminCreateUserAddressSchema,
  adminUserAddressQuerySchema,
  updateUserAddressSchema,
  userAddressIdSchema
} from "@/modules/user-addresses/user-addresses.validation";

export const adminUserAddressesRoute = Router();

adminUserAddressesRoute.get(
  "/",
  validate(adminUserAddressQuerySchema),
  userAddressController.getAllAddresses
);
adminUserAddressesRoute.post(
  "/",
  validate(adminCreateUserAddressSchema),
  userAddressController.createAddressForUser
);
adminUserAddressesRoute.patch(
  "/:id",
  validate(updateUserAddressSchema),
  userAddressController.updateAddressByAdmin
);
adminUserAddressesRoute.delete(
  "/:id",
  validate(userAddressIdSchema),
  userAddressController.deleteAddressByAdmin
);
adminUserAddressesRoute.patch(
  "/:id/default",
  validate(userAddressIdSchema),
  userAddressController.setDefaultAddressByAdmin
);
