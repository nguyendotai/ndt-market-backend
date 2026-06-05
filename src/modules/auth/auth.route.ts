import { Router } from "express";

import { getAuth } from "@/modules/auth/auth.controller";

export const authRoute = Router();

authRoute.get("/", getAuth);
