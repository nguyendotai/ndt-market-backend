import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { getNearbyStores, getStores } from "@/modules/stores/stores.controller";
import { nearbyStoresQuerySchema } from "@/modules/stores/stores.validation";

export const storesRoute = Router();

storesRoute.get("/", getStores);
storesRoute.get("/nearby", validate(nearbyStoresQuerySchema), getNearbyStores);
