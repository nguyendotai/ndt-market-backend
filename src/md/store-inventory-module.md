# Module Cửa Hàng Và Tồn Kho

Module Store và Inventory quản lý cửa hàng, tồn kho theo biến thể sản phẩm và lịch sử biến động kho.

## Store model

Model cửa hàng gồm:

- `name`
- `phone`
- `province`
- `district`
- `ward`
- `address`
- `latitude`
- `longitude`
- `openingHours`
- `status`: `ACTIVE`, `INACTIVE`

## Inventory model

Model tồn kho gồm:

- `store`: Cửa hàng.
- `variant`: Biến thể sản phẩm.
- `quantity`: Tổng số lượng tồn vật lý.
- `reservedQuantity`: Số lượng đang được giữ chỗ cho đơn hàng.

Tồn kho có thể bán được tính theo công thức:

```text
availableQuantity = quantity - reservedQuantity
```

## StockMovement model

Model lịch sử biến động kho gồm:

- `store`
- `variant`
- `type`: `IMPORT`, `EXPORT`, `ADJUST`, `RESERVE`, `RELEASE`
- `quantity`
- `reason`
- `createdBy`

## API cửa hàng

API public:

- `GET /api/v1/stores`: Lấy danh sách cửa hàng đang active.
- `GET /api/v1/stores/nearby`: Lấy cửa hàng gần vị trí người dùng.

API quản trị:

- `POST /api/v1/admin/stores`: Tạo cửa hàng.
- `PATCH /api/v1/admin/stores/:id`: Cập nhật cửa hàng.
- `DELETE /api/v1/admin/stores/:id`: Xóa cửa hàng.

## API tồn kho

API public:

- `GET /api/v1/products/:variantId/inventory?storeId=`: Kiểm tra tồn kho của một biến thể sản phẩm.

API quản trị:

- `GET /api/v1/admin/inventories`: Lấy danh sách tồn kho.
- `PATCH /api/v1/admin/inventories/:id`: Cập nhật tồn kho.
- `POST /api/v1/admin/inventories/import`: Nhập kho.
- `POST /api/v1/admin/inventories/adjust`: Điều chỉnh tồn kho.
- `POST /api/v1/admin/inventories/reserve`: Giữ chỗ tồn kho khi đặt hàng.
- `POST /api/v1/admin/inventories/release`: Hoàn lại tồn kho giữ chỗ khi hủy đơn.

## Quy tắc nghiệp vụ

- Khi đặt hàng, hệ thống gọi `reserveStock` để tăng `reservedQuantity`.
- Khi hủy đơn, hệ thống gọi `releaseStock` để giảm `reservedQuantity`.
- Không cho phép `reservedQuantity` lớn hơn `quantity`.
- Không cho phép điều chỉnh khiến `quantity` nhỏ hơn `reservedQuantity`.
