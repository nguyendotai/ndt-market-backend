import { User } from "@/modules/users/users.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: Omit<User, "password" | "comparePassword">;
  }
}
