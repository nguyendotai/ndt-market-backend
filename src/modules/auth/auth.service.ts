import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput
} from "@/modules/auth/auth.validation";
import { UserDocument, UserModel, USER_STATUSES } from "@/modules/users/users.model";
import { ApiError } from "@/utils/ApiError";
import { generateAccessToken } from "@/utils/generateToken";

type SafeUser = ReturnType<UserDocument["toObject"]>;

const toSafeUser = (user: UserDocument): SafeUser => user.toObject();

const createAuthPayload = (user: UserDocument) => ({
  user: toSafeUser(user),
  accessToken: generateAccessToken({
    userId: user._id.toString(),
    role: user.role
  })
});

export const register = async (payload: RegisterInput) => {
  const existingUser = await UserModel.findOne({ email: payload.email });

  if (existingUser) {
    throw new ApiError("Email already exists", HTTP_STATUS.CONFLICT);
  }

  const user = await UserModel.create(payload);

  return createAuthPayload(user);
};

export const login = async (payload: LoginInput) => {
  const user = await UserModel.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError("Your account is blocked", HTTP_STATUS.FORBIDDEN);
  }

  const isPasswordMatched = await user.comparePassword(payload.password);

  if (!isPasswordMatched) {
    throw new ApiError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  return createAuthPayload(user);
};

export const getMe = async (userId: string | Types.ObjectId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};

export const changePassword = async (
  userId: string | Types.ObjectId,
  payload: ChangePasswordInput
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new ApiError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const isPasswordMatched = await user.comparePassword(payload.currentPassword);

  if (!isPasswordMatched) {
    throw new ApiError("Current password is incorrect", HTTP_STATUS.UNAUTHORIZED);
  }

  user.password = payload.newPassword;
  await user.save();

  return toSafeUser(user);
};

export const logout = () => ({
  loggedOut: true
});

export const authService = {
  register,
  login,
  getMe,
  changePassword,
  logout
};
