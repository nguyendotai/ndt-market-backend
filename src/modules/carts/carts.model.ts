import { model, Schema, Types } from "mongoose";

export type Cart = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  store?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  _id: Types.ObjectId;
  cart: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  priceSnapshot: number;
  createdAt: Date;
  updatedAt: Date;
};

const cartSchema = new Schema<Cart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const cartItemSchema = new Schema<CartItem>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
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
      min: 1
    },
    priceSnapshot: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

cartItemSchema.index({ cart: 1, variant: 1 }, { unique: true });

export const CartModel = model<Cart>("Cart", cartSchema);
export const CartItemModel = model<CartItem>("CartItem", cartItemSchema);
