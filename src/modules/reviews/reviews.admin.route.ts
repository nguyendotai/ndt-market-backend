import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { updateReviewStatus } from "@/modules/reviews/reviews.controller";
import { updateReviewStatusSchema } from "@/modules/reviews/reviews.validation";

export const adminReviewsRoute = Router();

adminReviewsRoute.patch("/:id/status", validate(updateReviewStatusSchema), updateReviewStatus);
