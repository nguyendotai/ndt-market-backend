# Module Giao Hàng

Module Delivery quản lý khung giờ giao hàng, hồ sơ shipper và shipment cho đơn hàng.

## DeliveryTimeSlot model

Model khung giờ giao hàng gồm:

- `store`
- `startTime`
- `endTime`
- `maxOrders`
- `currentOrders`
- `isActive`

`startTime` và `endTime` lưu dạng Date, nên API có thể lọc theo `date`.

## Shipment model

Model shipment gồm:

- `order`
- `shipper`
- `address`
- `timeSlot`
- `shippingPartner`
- `trackingCode`
- `status`: `PENDING`, `ASSIGNED`, `PICKED_UP`, `DELIVERING`, `DELIVERED`, `FAILED`
- `note`

## Shipper model

Model shipper gồm:

- `user`
- `vehicleType`
- `status`: `AVAILABLE`, `BUSY`, `OFFLINE`

## API public

- `GET /api/v1/delivery/time-slots?storeId=&date=`: Lấy khung giờ giao hàng đang active theo cửa hàng và ngày.

## API quản trị

- `POST /api/v1/admin/delivery/time-slots`: Tạo khung giờ giao hàng.
- `PATCH /api/v1/admin/delivery/time-slots/:id`: Cập nhật khung giờ giao hàng.
- `POST /api/v1/admin/shipments/:orderId/assign`: Gán shipper cho đơn hàng.

## API shipper

- `GET /api/v1/shipper/shipments`: Lấy các shipment được assign cho shipper hiện tại.
- `PATCH /api/v1/shipper/shipments/:id/status`: Cập nhật trạng thái shipment của shipper hiện tại.

## Quy tắc nghiệp vụ

- Checkout đơn `DELIVERY` bắt buộc chọn `timeSlot`.
- Khi checkout, hệ thống tăng `currentOrders` của time slot.
- Không cho phép `currentOrders` vượt quá `maxOrders`.
- Nếu checkout lỗi, hệ thống rollback `currentOrders`.
- Khi hủy đơn, hệ thống giảm `currentOrders` của time slot.
- Shipper chỉ xem và cập nhật shipment được assign cho chính mình.
- Khi shipment `DELIVERED` hoặc `FAILED`, shipper được chuyển về trạng thái `AVAILABLE`.
