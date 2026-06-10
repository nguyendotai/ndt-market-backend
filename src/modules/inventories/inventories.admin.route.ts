import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  adjustInventory,
  getInventories,
  getStockMovements,
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
  stockMovementListQuerySchema,
  updateInventorySchema
} from "@/modules/inventories/inventories.validation";

export const adminInventoriesRoute = Router();

adminInventoriesRoute.get("/", validate(inventoryListQuerySchema), getInventories);
adminInventoriesRoute.get(
  "/movements",
  validate(stockMovementListQuerySchema),
  getStockMovements
);
adminInventoriesRoute.patch("/:id", validate(updateInventorySchema), updateInventory);
adminInventoriesRoute.post("/import", validate(importInventorySchema), importInventory);
adminInventoriesRoute.post("/adjust", validate(adjustInventorySchema), adjustInventory);
adminInventoriesRoute.post("/reserve", validate(reserveInventorySchema), reserveStock);
adminInventoriesRoute.post("/release", validate(releaseInventorySchema), releaseStock);
