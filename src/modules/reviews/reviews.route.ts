import { Router } from "express";

import { getReviews } from "@/modules/reviews/reviews.controller";

export const reviewsRoute = Router();

reviewsRoute.get("/", getReviews);
