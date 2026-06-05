import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { authController } from "@/modules/auth/auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema
} from "@/modules/auth/auth.validation";

export const authRoute = Router();

authRoute.post("/register", validate(registerSchema), authController.register);
authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.get("/me", authMiddleware, authController.getMe);
authRoute.post("/logout", authMiddleware, authController.logout);
authRoute.patch(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword
);
