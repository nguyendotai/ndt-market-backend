import { FilterQuery } from "mongoose";

import { HTTP_STATUS, ROLES } from "@/constants";
import { User, UserModel } from "@/modules/users/users.model";
import {
  AdminUserListQuery,
  UpdateUserRoleInput,
  UpdateUserStatusInput
} from "@/modules/users/users.validation";
import { ApiError } from "@/utils/ApiError";

const getSearchKeyword = (query: AdminUserListQuery) => query.keyword || query.search;

export const getUsersOverview = () => ({
  module: "users"
});

export const getAdminUsers = async (query: AdminUserListQuery) => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const userQuery: FilterQuery<User> = {};
  const keyword = getSearchKeyword(query);

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    userQuery.$or = [
      { fullName: keywordRegex },
      { email: keywordRegex },
      { phone: keywordRegex }
    ];
  }

  if (query.role) {
    userQuery.role = query.role;
  }

  if (query.status) {
    userQuery.status = query.status;
  }

  const [total, users] = await Promise.all([
    UserModel.countDocuments(userQuery),
    UserModel.find(userQuery).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getAdminUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

export const updateUserStatus = async (id: string, payload: UpdateUserStatusInput) => {
  const user = await UserModel.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true }
  );

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

export const updateUserRole = async (id: string, payload: UpdateUserRoleInput) => {
  const updatePayload = {
    role: payload.role,
    ...(payload.permissions ? { permissions: payload.permissions } : {}),
    ...(payload.role === ROLES.CUSTOMER ? { permissions: [] } : {})
  };
  const user = await UserModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return user;
};
