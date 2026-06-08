import { model, Schema, Types } from "mongoose";

export const STOCK_MOVEMENT_TYPES = {
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
  ADJUST: "ADJUST",
  RESERVE: "RESERVE",
  RELEASE: "RELEASE"
} as const;

export type StockMovementType =
  (typeof STOCK_MOVEMENT_TYPES)[keyof typeof STOCK_MOVEMENT_TYPES];

export type Inventory = {
  _id: Types.ObjectId;
  store: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  reservedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StockMovement = {
  _id: Types.ObjectId;
  store: Types.ObjectId;
  variant: Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const inventorySchema = new Schema<Inventory>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    reservedQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const stockMovementSchema = new Schema<StockMovement>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(STOCK_MOVEMENT_TYPES),
      required: true,
      index: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      trim: true,
      default: ""
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

inventorySchema.index({ store: 1, variant: 1 }, { unique: true });

export const InventoryModel = model<Inventory>("Inventory", inventorySchema);
export const StockMovementModel = model<StockMovement>(
  "StockMovement",
  stockMovementSchema
);
