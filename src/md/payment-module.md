# Module Thanh Toán

Module Payment quản lý thanh toán cho đơn hàng.

## Payment model

Model thanh toán gồm:

- `order`: Đơn hàng liên quan.
- `method`: `COD`, `MOMO`, `ZALOPAY`, `VNPAY`, `BANK_TRANSFER`.
- `amount`: Số tiền cần thanh toán.
- `status`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`.
- `transactionCode`: Mã giao dịch.
- `paidAt`: Thời điểm thanh toán thành công.
- `rawResponse`: Dữ liệu phản hồi gốc từ cổng thanh toán hoặc admin.

## API khách hàng/webhook

- `POST /api/v1/payments/:orderCode/create`: Tạo payment cho đơn hàng.
- `POST /api/v1/payments/webhook/momo`: Nhận webhook Momo.
- `POST /api/v1/payments/webhook/vnpay`: Nhận webhook VNPAY.
- `GET /api/v1/payments/:orderCode`: Lấy thông tin payment theo mã đơn.

## API quản trị

- `PATCH /api/v1/admin/payments/:id/confirm`: Xác nhận thanh toán thành công.
- `PATCH /api/v1/admin/payments/:id/refund`: Hoàn tiền payment.

## Quy tắc nghiệp vụ

- Giai đoạn đầu chỉ implement luồng `COD` và `BANK_TRANSFER`.
- Với `COD`, payment có trạng thái `PENDING`.
- Với `BANK_TRANSFER`, payment có trạng thái `PENDING` cho đến khi admin xác nhận.
- Khi admin confirm payment, hệ thống cập nhật `Payment.status = PAID` và `Order.paymentStatus = PAID`.
- Khi admin refund payment, hệ thống cập nhật `Payment.status = REFUNDED` và `Order.paymentStatus = REFUNDED`.
- Webhook Momo và VNPAY hiện chỉ nhận payload và trả acknowledgement để chuẩn bị cho tích hợp thật sau này.
