import { HTTP_STATUS } from "@/constants";
import {
  AdminRoleModel,
  PermissionModel,
  RolePermissionModel
} from "@/modules/admin/rbac.model";
import {
  AssignRolePermissionsInput,
  CreatePermissionInput,
  CreateRoleInput,
  UpdateRoleInput
} from "@/modules/admin/rbac.validation";
import { ApiError } from "@/utils/ApiError";

const normalizeRoleName = (name: string) => name.trim().toUpperCase();
const normalizePermissionKey = (key: string) => key.trim().toLowerCase();
const normalizePermissionGroup = (group: string) => group.trim().toLowerCase();

export const getRoles = async () => {
  const roles = await AdminRoleModel.find().sort({ name: 1 }).lean();
  const rolePermissions = await RolePermissionModel.find({
    role: { $in: roles.map((role) => role._id) }
  })
    .populate("permission")
    .lean();

  return roles.map((role) => ({
    ...role,
    permissions: rolePermissions
      .filter((item) => String(item.role) === String(role._id))
      .map((item) => item.permission)
  }));
};

export const createRole = async (payload: CreateRoleInput) => {
  const name = normalizeRoleName(payload.name);
  const existingRole = await AdminRoleModel.findOne({ name });

  if (existingRole) {
    throw new ApiError("Role name already exists", HTTP_STATUS.CONFLICT);
  }

  return AdminRoleModel.create({
    name,
    description: payload.description
  });
};

export const updateRole = async (id: string, payload: UpdateRoleInput) => {
  const updatePayload = {
    ...payload,
    ...(payload.name ? { name: normalizeRoleName(payload.name) } : {})
  };
  const role = await AdminRoleModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (!role) {
    throw new ApiError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  return role;
};

export const deleteRole = async (id: string) => {
  const role = await AdminRoleModel.findByIdAndDelete(id);

  if (!role) {
    throw new ApiError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  await RolePermissionModel.deleteMany({ role: id });

  return role;
};

export const getPermissions = () => PermissionModel.find().sort({ group: 1, key: 1 });

export const createPermission = async (payload: CreatePermissionInput) => {
  const key = normalizePermissionKey(payload.key);
  const existingPermission = await PermissionModel.findOne({ key });

  if (existingPermission) {
    throw new ApiError("Permission key already exists", HTTP_STATUS.CONFLICT);
  }

  return PermissionModel.create({
    name: payload.name,
    key,
    group: normalizePermissionGroup(payload.group)
  });
};

export const assignRolePermissions = async (
  roleId: string,
  payload: AssignRolePermissionsInput
) => {
  const role = await AdminRoleModel.findById(roleId);

  if (!role) {
    throw new ApiError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  const permissions = await PermissionModel.find({ _id: { $in: payload.permissionIds } });

  if (permissions.length !== payload.permissionIds.length) {
    throw new ApiError("One or more permissions were not found", HTTP_STATUS.BAD_REQUEST);
  }

  await RolePermissionModel.insertMany(
    payload.permissionIds.map((permission) => ({
      role: roleId,
      permission
    })),
    { ordered: false }
  ).catch((error: unknown) => {
    const mongoError = error as { code?: number };

    if (mongoError.code !== 11000) {
      throw error;
    }
  });

  return RolePermissionModel.find({ role: roleId }).populate("permission");
};

export const removeRolePermission = async (roleId: string, permissionId: string) => {
  const rolePermission = await RolePermissionModel.findOneAndDelete({
    role: roleId,
    permission: permissionId
  });

  if (!rolePermission) {
    throw new ApiError("Role permission not found", HTTP_STATUS.NOT_FOUND);
  }

  return rolePermission;
};

export const getPermissionKeysByRoleName = async (roleName: string) => {
  const role = await AdminRoleModel.findOne({ name: normalizeRoleName(roleName) });

  if (!role) {
    return [];
  }

  const rolePermissions = await RolePermissionModel.find({ role: role._id }).populate<{
    permission: { key: string };
  }>("permission");

  return rolePermissions.map((item) => item.permission.key);
};
