import { model, Schema, Types } from "mongoose";

export const PAYMENT_METHODS = {
  COD: "COD",
  MOMO: "MOMO",
  ZALOPAY: "ZALOPAY",
  VNPAY: "VNPAY",
  BANK_TRANSFER: "BANK_TRANSFER"
} as const;

export const PAYMENT_RECORD_STATUSES = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
export type PaymentRecordStatus =
  (typeof PAYMENT_RECORD_STATUSES)[keyof typeof PAYMENT_RECORD_STATUSES];

export type Payment = {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  method: PaymentMethod;
  amount: number;
  status: PaymentRecordStatus;
  transactionCode?: string;
  paidAt?: Date;
  rawResponse?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const paymentSchema = new Schema<Payment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_RECORD_STATUSES),
      default: PAYMENT_RECORD_STATUSES.PENDING,
      index: true
    },
    transactionCode: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    },
    rawResponse: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

paymentSchema.index({ order: 1, method: 1 });

export const PaymentModel = model<Payment>("Payment", paymentSchema);
