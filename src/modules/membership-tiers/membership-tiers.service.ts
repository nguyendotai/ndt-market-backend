import { HTTP_STATUS } from "@/constants";
import { MembershipTierModel } from "@/modules/membership-tiers/membership-tiers.model";
import {
  CreateMembershipTierInput,
  UpdateMembershipTierInput
} from "@/modules/membership-tiers/membership-tiers.validation";
import { ApiError } from "@/utils/ApiError";

export const getMembershipTiers = () => MembershipTierModel.find().sort({ minPoint: 1 });

export const getMembershipTierById = async (id: string) => {
  const tier = await MembershipTierModel.findById(id);

  if (!tier) {
    throw new ApiError("Membership tier not found", HTTP_STATUS.NOT_FOUND);
  }

  return tier;
};

export const createMembershipTier = async (payload: CreateMembershipTierInput) => {
  const existingTier = await MembershipTierModel.findOne({ name: payload.name });

  if (existingTier) {
    throw new ApiError("Membership tier name already exists", HTTP_STATUS.CONFLICT);
  }

  return MembershipTierModel.create(payload);
};

export const updateMembershipTier = async (
  id: string,
  payload: UpdateMembershipTierInput
) => {
  const tier = await MembershipTierModel.findByIdAndUpdate(id, payload, { new: true });

  if (!tier) {
    throw new ApiError("Membership tier not found", HTTP_STATUS.NOT_FOUND);
  }

  return tier;
};

export const deleteMembershipTier = async (id: string) => {
  const tier = await MembershipTierModel.findByIdAndDelete(id);

  if (!tier) {
    throw new ApiError("Membership tier not found", HTTP_STATUS.NOT_FOUND);
  }

  return tier;
};
