import { model, Schema, Types } from "mongoose";

export const PRODUCT_STATUSES = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  OUT_OF_STOCK: "OUT_OF_STOCK"
} as const;

export const PRODUCT_VARIANT_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  OUT_OF_STOCK: "OUT_OF_STOCK"
} as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];
export type ProductVariantStatus =
  (typeof PRODUCT_VARIANT_STATUSES)[keyof typeof PRODUCT_VARIANT_STATUSES];

export type Product = {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  brand?: Types.ObjectId | null;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  unit?: string;
  origin?: string;
  ingredients?: string[];
  storageInstruction?: string;
  status: ProductStatus;
  tags: string[];
  soldCount: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductVariant = {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  name: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  weight?: number;
  unit?: string;
  status: ProductVariantStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductImage = {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const productSchema = new Schema<Product>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    sku: {
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
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ""
    },
    unit: {
      type: String,
      trim: true,
      default: ""
    },
    origin: {
      type: String,
      trim: true,
      default: ""
    },
    ingredients: {
      type: [String],
      default: []
    },
    storageInstruction: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUSES),
      default: PRODUCT_STATUSES.DRAFT,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const productVariantSchema = new Schema<ProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    barcode: {
      type: String,
      trim: true,
      sparse: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    salePrice: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_VARIANT_STATUSES),
      default: PRODUCT_VARIANT_STATUSES.ACTIVE,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const productImageSchema = new Schema<ProductImage>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    isThumbnail: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ProductModel = model<Product>("Product", productSchema);
export const ProductVariantModel = model<ProductVariant>(
  "ProductVariant",
  productVariantSchema
);
export const ProductImageModel = model<ProductImage>("ProductImage", productImageSchema);
