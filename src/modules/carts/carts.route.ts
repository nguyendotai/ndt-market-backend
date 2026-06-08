import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
  updateCartStore
} from "@/modules/carts/carts.controller";
import {
  addCartItemSchema,
  cartItemIdSchema,
  updateCartItemSchema,
  updateCartStoreSchema
} from "@/modules/carts/carts.validation";

export const cartsRoute = Router();

cartsRoute.use(authMiddleware);
cartsRoute.get("/", getCart);
cartsRoute.post("/items", validate(addCartItemSchema), addCartItem);
cartsRoute.patch("/items/:itemId", validate(updateCartItemSchema), updateCartItem);
cartsRoute.delete("/items/:itemId", validate(cartItemIdSchema), deleteCartItem);
cartsRoute.delete("/clear", clearCart);
cartsRoute.patch("/store", validate(updateCartStoreSchema), updateCartStore);
