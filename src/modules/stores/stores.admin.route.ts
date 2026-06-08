import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { createStore, deleteStore, updateStore } from "@/modules/stores/stores.controller";
import {
  createStoreSchema,
  storeIdSchema,
  updateStoreSchema
} from "@/modules/stores/stores.validation";

export const adminStoresRoute = Router();

adminStoresRoute.post("/", validate(createStoreSchema), createStore);
adminStoresRoute.patch("/:id", validate(updateStoreSchema), updateStore);
adminStoresRoute.delete("/:id", validate(storeIdSchema), deleteStore);
