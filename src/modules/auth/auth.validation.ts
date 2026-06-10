import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must not exceed 72 characters");

const optionalTextSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional()
);

const optionalPhoneSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(8).max(20).optional()
);

const optionalUrlSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().url("Avatar must be a valid URL").optional()
);

const normalizeRegisterPayload = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const payload = value as Record<string, unknown>;

  return {
    ...payload,
    confirmPassword:
      payload.confirmPassword ?? payload.confirmpassword ?? payload.confirm_password
  };
};

export const registerSchema = {
  body: z.preprocess(
    normalizeRegisterPayload,
    z
      .object({
        fullName: optionalTextSchema,
        phone: optionalPhoneSchema,
        email: z.string().trim().email("Email is invalid").toLowerCase(),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Confirm password is required"),
        avatar: optionalUrlSchema
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm password must match password",
        path: ["confirmPassword"]
      })
  )
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
