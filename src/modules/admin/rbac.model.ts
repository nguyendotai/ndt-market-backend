import { model, Schema, Types } from "mongoose";

export type AdminRole = {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Permission = {
  _id: Types.ObjectId;
  name: string;
  key: string;
  group: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RolePermission = {
  _id: Types.ObjectId;
  role: Types.ObjectId;
  permission: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const roleSchema = new Schema<AdminRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const permissionSchema = new Schema<Permission>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    group: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const rolePermissionSchema = new Schema<RolePermission>(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: "AdminRole",
      required: true,
      index: true
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

export const AdminRoleModel = model<AdminRole>("AdminRole", roleSchema);
export const PermissionModel = model<Permission>("Permission", permissionSchema);
export const RolePermissionModel = model<RolePermission>(
  "RolePermission",
  rolePermissionSchema
);
