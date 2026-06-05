import { Router } from "express";

import { getStores } from "@/modules/stores/stores.controller";

export const storesRoute = Router();

storesRoute.get("/", getStores);
