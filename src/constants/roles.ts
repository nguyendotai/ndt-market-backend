export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  SHIPPER: "SHIPPER",
  SUPER_ADMIN: "SUPER_ADMIN"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
