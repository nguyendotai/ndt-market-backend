import { model, Schema, Types } from "mongoose";

export const ARTICLE_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
} as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[keyof typeof ARTICLE_STATUSES];

export type ArticleCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Article = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  thumbnail?: string;
  content: string;
  excerpt?: string;
  category?: Types.ObjectId;
  author: Types.ObjectId;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const articleCategorySchema = new Schema<ArticleCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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

const articleSchema = new Schema<Article>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    thumbnail: {
      type: String,
      trim: true,
      default: ""
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ArticleCategory"
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ARTICLE_STATUSES),
      default: ARTICLE_STATUSES.DRAFT,
      index: true
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ArticleCategoryModel = model<ArticleCategory>(
  "ArticleCategory",
  articleCategorySchema
);
export const ArticleModel = model<Article>("Article", articleSchema);
