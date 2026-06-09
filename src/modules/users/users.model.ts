import bcrypt from "bcryptjs";
import { HydratedDocument, model, Schema, Types } from "mongoose";

import { ROLES, Role } from "@/constants";

export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED"
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export type User = {
  _id: Types.ObjectId;
  fullName: string;
  phone?: string;
  email: string;
  password: string;
  avatar?: string;
  role: Role;
  permissions?: string[];
  status: UserStatus;
  membershipTier: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
};

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    avatar: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER
    },
    permissions: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE
    },
    membershipTier: {
      type: String,
      default: "BRONZE"
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as { password?: string }).password;
        return ret;
      }
    },
    toObject: {
      transform: (_doc, ret) => {
        delete (ret as { password?: string }).password;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<User>("User", userSchema);
