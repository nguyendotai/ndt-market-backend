import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  AdminCreateUserAddressInput,
  CreateUserAddressInput,
  UpdateUserAddressInput
} from "@/modules/user-addresses/user-addresses.validation";
import { UserAddressModel } from "@/modules/user-addresses/user-addresses.model";
import { ApiError } from "@/utils/ApiError";

const setDefaultAddress = async (userId: string | Types.ObjectId, addressId: string) => {
  await UserAddressModel.updateMany({ user: userId }, { isDefault: false });

  return UserAddressModel.findOneAndUpdate(
    { _id: addressId, user: userId },
    { isDefault: true },
    { new: true }
  );
};

export const getMyAddresses = (userId: string | Types.ObjectId) =>
  UserAddressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

export const createMyAddress = async (
  userId: string | Types.ObjectId,
  payload: CreateUserAddressInput
) => {
  const shouldSetDefault =
    payload.isDefault ?? ((await UserAddressModel.countDocuments({ user: userId })) === 0);

  if (shouldSetDefault) {
    await UserAddressModel.updateMany({ user: userId }, { isDefault: false });
  }

  return UserAddressModel.create({
    ...payload,
    user: userId,
    isDefault: shouldSetDefault
  });
};

export const updateMyAddress = async (
  userId: string | Types.ObjectId,
  addressId: string,
  payload: UpdateUserAddressInput
) => {
  if (payload.isDefault) {
    await UserAddressModel.updateMany({ user: userId }, { isDefault: false });
  }

  const address = await UserAddressModel.findOneAndUpdate(
    { _id: addressId, user: userId },
    payload,
    { new: true }
  );

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  return address;
};

export const deleteMyAddress = async (userId: string | Types.ObjectId, addressId: string) => {
  const address = await UserAddressModel.findOneAndDelete({ _id: addressId, user: userId });

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  return address;
};

export const setMyDefaultAddress = async (userId: string | Types.ObjectId, addressId: string) => {
  const address = await setDefaultAddress(userId, addressId);

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  return address;
};

export const getAllAddresses = (userId?: string) => {
  const query = userId ? { user: userId } : {};

  return UserAddressModel.find(query).sort({ createdAt: -1 });
};

export const createAddressForUser = (payload: AdminCreateUserAddressInput) =>
  createMyAddress(payload.user, payload);

export const updateAddressByAdmin = async (addressId: string, payload: UpdateUserAddressInput) => {
  const address = await UserAddressModel.findById(addressId);

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  if (payload.isDefault) {
    await UserAddressModel.updateMany({ user: address.user }, { isDefault: false });
  }

  Object.assign(address, payload);
  await address.save();

  return address;
};

export const deleteAddressByAdmin = async (addressId: string) => {
  const address = await UserAddressModel.findByIdAndDelete(addressId);

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  return address;
};

export const setDefaultAddressByAdmin = async (addressId: string) => {
  const address = await UserAddressModel.findById(addressId);

  if (!address) {
    throw new ApiError("Address not found", HTTP_STATUS.NOT_FOUND);
  }

  return setDefaultAddress(address.user, addressId);
};
