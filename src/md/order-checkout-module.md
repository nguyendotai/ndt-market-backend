# Module Đơn Hàng Và Checkout

Module Order và Checkout xử lý tạo đơn hàng từ giỏ hàng, giữ tồn kho và quản lý trạng thái đơn.

## Order model

Model đơn hàng gồm:

- `user`
- `store`
- `orderCode`
- `status`: `PENDING`, `CONFIRMED`, `PREPARING`, `SHIPPING`, `COMPLETED`, `CANCELLED`, `REFUNDED`
- `subtotal`
- `discountTotal`
- `shippingFee`
- `total`
- `paymentStatus`
- `deliveryType`: `DELIVERY`, `PICKUP`
- `address`
- `timeSlot`
- `note`

## OrderItem model

Model item đơn hàng lưu snapshot sản phẩm:

- `order`
- `variant`
- `productName`
- `variantName`
- `quantity`
- `price`
- `total`

## OrderStatusHistory model

Model lịch sử trạng thái gồm:

- `order`
- `status`
- `note`
- `changedBy`

## API khách hàng

- `POST /api/v1/checkout`: Tạo đơn hàng từ cart hiện tại.
- `GET /api/v1/orders`: Lấy danh sách đơn hàng của người dùng.
- `GET /api/v1/orders/:orderCode`: Lấy chi tiết đơn hàng theo mã đơn.
- `PATCH /api/v1/orders/:orderCode/cancel`: Hủy đơn hàng của người dùng.

## API quản trị

- `GET /api/v1/admin/orders`: Lấy danh sách đơn hàng.
- `GET /api/v1/admin/orders/:id`: Lấy chi tiết đơn hàng.
- `PATCH /api/v1/admin/orders/:id/status`: Cập nhật trạng thái đơn hàng.

## Quy tắc nghiệp vụ

- Checkout tạo đơn hàng từ cart active của người dùng.
- Cart phải có store và ít nhất một item.
- Khi checkout, hệ thống kiểm tra product và variant còn active.
- Khi checkout, hệ thống kiểm tra tồn kho và gọi `reserveStock` cho từng item.
- Nếu checkout lỗi sau khi đã giữ tồn, hệ thống rollback bằng `releaseStock`.
- Sau khi tạo đơn thành công, hệ thống xóa item trong cart.
- Order item lưu snapshot `productName`, `variantName`, `quantity`, `price` và `total`.
- `orderCode` tự động sinh theo dạng `ORDYYYYMMDD0001`.
- Khi hủy đơn, hệ thống gọi `releaseStock` để hoàn lại tồn kho đã giữ.
