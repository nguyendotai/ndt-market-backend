import { PAYMENT_STATUS, HTTP_STATUS } from "@/constants";
import { OrderModel } from "@/modules/orders/orders.model";
import {
  PAYMENT_METHODS,
  PAYMENT_RECORD_STATUSES,
  PaymentModel
} from "@/modules/payments/payments.model";
import {
  ConfirmPaymentInput,
  CreatePaymentInput,
  RefundPaymentInput
} from "@/modules/payments/payments.validation";
import { ApiError } from "@/utils/ApiError";

const getOrderByCodeOrFail = async (orderCode: string) => {
  const order = await OrderModel.findOne({ orderCode });

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

const getPaymentByIdOrFail = async (id: string) => {
  const payment = await PaymentModel.findById(id);

  if (!payment) {
    throw new ApiError("Payment not found", HTTP_STATUS.NOT_FOUND);
  }

  return payment;
};

export const createPayment = async (orderCode: string, payload: CreatePaymentInput) => {
  const order = await getOrderByCodeOrFail(orderCode);
  const existingPayment = await PaymentModel.findOne({
    order: order._id,
    status: { $ne: PAYMENT_RECORD_STATUSES.REFUNDED }
  });

  if (existingPayment) {
    return existingPayment.populate("order");
  }

  const payment = await PaymentModel.create({
    order: order._id,
    method: payload.method,
    amount: order.total,
    status: PAYMENT_RECORD_STATUSES.PENDING,
    transactionCode: payload.transactionCode,
    rawResponse: {
      note:
        payload.method === PAYMENT_METHODS.COD
          ? "COD payment will be collected on delivery"
          : "Bank transfer payment is waiting for admin confirmation"
    }
  });

  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  return payment.populate("order");
};

export const getPaymentByOrderCode = async (orderCode: string) => {
  const order = await getOrderByCodeOrFail(orderCode);
  const payment = await PaymentModel.findOne({ order: order._id })
    .populate("order")
    .sort({ createdAt: -1 });

  if (!payment) {
    throw new ApiError("Payment not found", HTTP_STATUS.NOT_FOUND);
  }

  return payment;
};

export const handleMomoWebhook = async (payload: Record<string, unknown>) => ({
  provider: PAYMENT_METHODS.MOMO,
  received: true,
  rawResponse: payload
});

export const handleVnpayWebhook = async (payload: Record<string, unknown>) => ({
  provider: PAYMENT_METHODS.VNPAY,
  received: true,
  rawResponse: payload
});

export const confirmPayment = async (id: string, payload: ConfirmPaymentInput) => {
  const payment = await getPaymentByIdOrFail(id);
  const order = await OrderModel.findById(payment.order);

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  if (payment.status === PAYMENT_RECORD_STATUSES.REFUNDED) {
    throw new ApiError("Refunded payment cannot be confirmed", HTTP_STATUS.BAD_REQUEST);
  }

  payment.status = PAYMENT_RECORD_STATUSES.PAID;
  payment.transactionCode = payload.transactionCode ?? payment.transactionCode;
  payment.paidAt = new Date();
  payment.rawResponse = payload.rawResponse ?? payment.rawResponse;
  await payment.save();

  order.paymentStatus = PAYMENT_STATUS.PAID;
  await order.save();

  return payment.populate("order");
};

export const refundPayment = async (id: string, payload: RefundPaymentInput) => {
  const payment = await getPaymentByIdOrFail(id);
  const order = await OrderModel.findById(payment.order);

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  if (payment.status !== PAYMENT_RECORD_STATUSES.PAID) {
    throw new ApiError("Only paid payments can be refunded", HTTP_STATUS.BAD_REQUEST);
  }

  payment.status = PAYMENT_RECORD_STATUSES.REFUNDED;
  payment.rawResponse = {
    ...(payment.rawResponse ?? {}),
    refundReason: payload.reason,
    refundResponse: payload.rawResponse
  };
  await payment.save();

  order.paymentStatus = PAYMENT_STATUS.REFUNDED;
  await order.save();

  return payment.populate("order");
};
