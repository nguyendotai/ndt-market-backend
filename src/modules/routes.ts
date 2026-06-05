import { Router } from "express";

import { healthRoutes } from "@/modules/health/health.routes";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
