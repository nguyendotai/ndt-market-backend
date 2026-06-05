import { Router } from "express";

import { getAdmin } from "@/modules/admin/admin.controller";

export const adminRoute = Router();

adminRoute.get("/", getAdmin);
