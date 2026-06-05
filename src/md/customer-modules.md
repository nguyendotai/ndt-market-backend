# Module Khách Hàng

Tài liệu này ghi nhận các module liên quan đến khách hàng, bao gồm địa chỉ giao hàng, hạng thành viên và điểm tích lũy.

## Địa chỉ người dùng

Route của người dùng được mount tại `/api/v1/user-addresses` và yêu cầu đăng nhập.

- `GET /user-addresses`: Lấy danh sách địa chỉ của người dùng hiện tại.
- `POST /user-addresses`: Tạo địa chỉ mới cho người dùng hiện tại.
- `PATCH /user-addresses/:id`: Cập nhật một địa chỉ của người dùng hiện tại.
- `DELETE /user-addresses/:id`: Xóa một địa chỉ của người dùng hiện tại.
- `PATCH /user-addresses/:id/default`: Đặt một địa chỉ của người dùng hiện tại làm mặc định.

Route quản trị được mount tại `/api/v1/admin/user-addresses` và yêu cầu quyền `ADMIN` hoặc `SUPER_ADMIN`.

## Hạng thành viên

Route CRUD dành cho quản trị được mount tại `/api/v1/admin/membership-tiers`.

Model lưu các thông tin `name`, `minPoint`, `discountPercent`, `benefits` và `status`.

## Điểm tích lũy

Route của người dùng:

- `GET /loyalty-points/me`: Lấy lịch sử điểm tích lũy của người dùng hiện tại.

Route quản trị:

- `GET /admin/loyalty-points`: Lấy tất cả bản ghi điểm tích lũy.
- `POST /admin/loyalty-points/adjust`: Điều chỉnh điểm của người dùng và cập nhật `users.totalPoints`.
