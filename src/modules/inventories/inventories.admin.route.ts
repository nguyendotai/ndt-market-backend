import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  adjustInventory,
  getInventories,
  importInventory,
  releaseStock,
  reserveStock,
  updateInventory
} from "@/modules/inventories/inventories.controller";
import {
  adjustInventorySchema,
  importInventorySchema,
  inventoryListQuerySchema,
  releaseInventorySchema,
  reserveInventorySchema,
  updateInventorySchema
} from "@/modules/inventories/inventories.validation";

export const adminInventoriesRoute = Router();

adminInventoriesRoute.get("/", validate(inventoryListQuerySchema), getInventories);
adminInventoriesRoute.patch("/:id", validate(updateInventorySchema), updateInventory);
adminInventoriesRoute.post("/import", validate(importInventorySchema), importInventory);
adminInventoriesRoute.post("/adjust", validate(adjustInventorySchema), adjustInventory);
adminInventoriesRoute.post("/reserve", validate(reserveInventorySchema), reserveStock);
adminInventoriesRoute.post("/release", validate(releaseInventorySchema), releaseStock);
