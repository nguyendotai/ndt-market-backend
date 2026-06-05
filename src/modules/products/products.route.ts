import { Router } from "express";

import { getProducts } from "@/modules/products/products.controller";

export const productsRoute = Router();

productsRoute.get("/", getProducts);
