export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  STAFF: "staff",
  SELLER: "seller"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
