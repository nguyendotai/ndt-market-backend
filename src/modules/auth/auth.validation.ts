import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must not exceed 72 characters");

export const registerSchema = {
  body: z
    .object({
      fullName: z.string().trim().min(1, "Full name is required"),
      phone: z.string().trim().min(8).max(20).optional(),
      email: z.string().trim().email("Email is invalid").toLowerCase(),
      password: passwordSchema,
      confirmPassword: z.string().min(1, "Confirm password is required"),
      avatar: z.string().trim().url("Avatar must be a valid URL").optional()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Confirm password must match password",
      path: ["confirmPassword"]
    })
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().email("Email is invalid").toLowerCase(),
    password: z.string().min(1, "Password is required")
  })
};

export const changePasswordSchema = {
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: passwordSchema
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"]
    })
};

export type RegisterInput = z.infer<typeof registerSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema.body>;

export const authValidation = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};
