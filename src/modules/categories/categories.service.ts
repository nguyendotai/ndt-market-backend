import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import { Category, CategoryModel } from "@/modules/categories/categories.model";
import {
  CreateCategoryInput,
  UpdateCategoryInput
} from "@/modules/categories/categories.validation";
import { ApiError } from "@/utils/ApiError";
import { slugify } from "@/utils/slugify";

type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
};

const ensureUniqueSlug = async (name: string, excludeId?: string) => {
  const slug = slugify(name);
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  const existingCategory = await CategoryModel.findOne(query);

  if (existingCategory) {
    throw new ApiError("Category slug already exists", HTTP_STATUS.CONFLICT);
  }

  return slug;
};

export const getPublicCategories = () =>
  CategoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });

export const getPublicCategoryTree = async () => {
  const categories = await CategoryModel.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean<CategoryTreeNode[]>();

  const categoryMap = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  categories.forEach((category) => {
    categoryMap.set(String(category._id), {
      ...category,
      children: []
    });
  });

  categoryMap.forEach((category) => {
    const parentId = category.parent ? String(category.parent) : null;
    const parent = parentId ? categoryMap.get(parentId) : null;

    if (parent) {
      parent.children.push(category);
      return;
    }

    roots.push(category);
  });

  return roots;
};

export const getPublicCategoryBySlug = async (slug: string) => {
  const category = await CategoryModel.findOne({ slug, isActive: true });

  if (!category) {
    throw new ApiError("Category not found", HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

export const createCategory = async (payload: CreateCategoryInput) => {
  const slug = await ensureUniqueSlug(payload.name);

  return CategoryModel.create({
    ...payload,
    parent: payload.parent ? new Types.ObjectId(payload.parent) : null,
    slug
  });
};

export const updateCategory = async (id: string, payload: UpdateCategoryInput) => {
  const updatePayload = {
    ...payload,
    ...(payload.name ? { slug: await ensureUniqueSlug(payload.name, id) } : {}),
    ...(payload.parent !== undefined
      ? { parent: payload.parent ? new Types.ObjectId(payload.parent) : null }
      : {})
  };

  const category = await CategoryModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (!category) {
    throw new ApiError("Category not found", HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

export const deleteCategory = async (id: string) => {
  const childCount = await CategoryModel.countDocuments({ parent: id });

  if (childCount > 0) {
    throw new ApiError("Cannot delete category with child categories", HTTP_STATUS.BAD_REQUEST);
  }

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError("Category not found", HTTP_STATUS.NOT_FOUND);
  }

  return category;
};
