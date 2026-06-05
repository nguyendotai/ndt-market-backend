import { Router } from "express";

import { getCarts } from "@/modules/carts/carts.controller";

export const cartsRoute = Router();

cartsRoute.get("/", getCarts);
