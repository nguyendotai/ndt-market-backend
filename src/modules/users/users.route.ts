import { Router } from "express";

import { getUsers } from "@/modules/users/users.controller";

export const usersRoute = Router();

usersRoute.get("/", getUsers);
