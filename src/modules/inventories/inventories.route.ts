import { Router } from "express";

import { getInventories } from "@/modules/inventories/inventories.controller";

export const inventoriesRoute = Router();

inventoriesRoute.get("/", getInventories);
