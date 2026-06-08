import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  addWishlistProduct,
  getWishlist,
  removeWishlistProduct
} from "@/modules/wishlists/wishlists.controller";
import { wishlistProductIdSchema } from "@/modules/wishlists/wishlists.validation";

export const wishlistsRoute = Router();

wishlistsRoute.use(authMiddleware);
wishlistsRoute.get("/", getWishlist);
wishlistsRoute.post("/:productId", validate(wishlistProductIdSchema), addWishlistProduct);
wishlistsRoute.delete("/:productId", validate(wishlistProductIdSchema), removeWishlistProduct);
