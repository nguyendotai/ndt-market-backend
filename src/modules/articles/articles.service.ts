import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  ARTICLE_STATUSES,
  ArticleCategoryModel,
  ArticleModel
} from "@/modules/articles/articles.model";
import {
  CreateArticleCategoryInput,
  CreateArticleInput,
  UpdateArticleInput
} from "@/modules/articles/articles.validation";
import { ApiError } from "@/utils/ApiError";
import { deleteCloudinaryImage } from "@/utils/cloudinary";
import { slugify } from "@/utils/slugify";

const ensureUniqueCategorySlug = async (name: string) => {
  const slug = slugify(name);
  const existingCategory = await ArticleCategoryModel.findOne({ slug });

  if (existingCategory) {
    throw new ApiError("Article category slug already exists", HTTP_STATUS.CONFLICT);
  }

  return slug;
};

const ensureUniqueArticleSlug = async (title: string, excludeId?: string) => {
  const slug = slugify(title);
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  const existingArticle = await ArticleModel.findOne(query);

  if (existingArticle) {
    throw new ApiError("Article slug already exists", HTTP_STATUS.CONFLICT);
  }

  return slug;
};

export const getPublicArticles = () =>
  ArticleModel.find({ status: ARTICLE_STATUSES.PUBLISHED })
    .populate("category author")
    .sort({ publishedAt: -1, createdAt: -1 });

export const getPublicArticleBySlug = async (slug: string) => {
  const article = await ArticleModel.findOne({
    slug,
    status: ARTICLE_STATUSES.PUBLISHED
  }).populate("category author");

  if (!article) {
    throw new ApiError("Article not found", HTTP_STATUS.NOT_FOUND);
  }

  return article;
};

export const createArticleCategory = async (payload: CreateArticleCategoryInput) =>
  ArticleCategoryModel.create({
    name: payload.name,
    slug: await ensureUniqueCategorySlug(payload.name)
  });

export const createArticle = async (
  authorId: string | Types.ObjectId,
  payload: CreateArticleInput
) =>
  ArticleModel.create({
    ...payload,
    author: authorId,
    slug: await ensureUniqueArticleSlug(payload.title),
    publishedAt:
      payload.status === ARTICLE_STATUSES.PUBLISHED
        ? payload.publishedAt ?? new Date()
        : payload.publishedAt
  });

export const updateArticle = async (id: string, payload: UpdateArticleInput) => {
  const currentArticle = await ArticleModel.findById(id);

  if (!currentArticle) {
    throw new ApiError("Article not found", HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload = {
    ...payload,
    ...(payload.title ? { slug: await ensureUniqueArticleSlug(payload.title, id) } : {}),
    ...(payload.status === ARTICLE_STATUSES.PUBLISHED && !payload.publishedAt
      ? { publishedAt: new Date() }
      : {})
  };

  const article = await ArticleModel.findByIdAndUpdate(id, updatePayload, { new: true });

  if (payload.thumbnail && payload.thumbnail !== currentArticle.thumbnail) {
    await deleteCloudinaryImage(currentArticle.thumbnail);
  }

  return article;
};

export const deleteArticle = async (id: string) => {
  const article = await ArticleModel.findByIdAndDelete(id);

  if (!article) {
    throw new ApiError("Article not found", HTTP_STATUS.NOT_FOUND);
  }

  await deleteCloudinaryImage(article.thumbnail);

  return article;
};
