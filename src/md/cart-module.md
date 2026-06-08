# Module Giỏ Hàng

Module Cart quản lý giỏ hàng active của khách hàng.

## Cart model

Model cart gồm:

- `user`: Người sở hữu giỏ hàng.
- `store`: Cửa hàng được chọn để kiểm tra tồn kho.

Mỗi user có một cart active. Nếu user chưa có cart, hệ thống tự tạo cart khi gọi API giỏ hàng.

## CartItem model

Model cart item gồm:

- `cart`: Giỏ hàng.
- `variant`: Biến thể sản phẩm.
- `quantity`: Số lượng trong giỏ.
- `priceSnapshot`: Giá tại thời điểm thêm/cập nhật sản phẩm vào giỏ.

## API

Tất cả route cart được mount tại `/api/v1/cart` và yêu cầu đăng nhập.

- `GET /cart`: Lấy giỏ hàng hiện tại.
- `POST /cart/items`: Thêm sản phẩm vào giỏ hàng.
- `PATCH /cart/items/:itemId`: Cập nhật số lượng item trong giỏ.
- `DELETE /cart/items/:itemId`: Xóa item khỏi giỏ.
- `DELETE /cart/clear`: Xóa toàn bộ item trong giỏ.
- `PATCH /cart/store`: Cập nhật cửa hàng của giỏ.

## Quy tắc nghiệp vụ

- Một user chỉ có một cart active.
- Trước khi thêm sản phẩm, user phải chọn store bằng `PATCH /cart/store`.
- Khi đổi store, hệ thống xóa các item hiện tại để tránh kiểm tra tồn kho sai cửa hàng.
- Khi thêm hoặc cập nhật item, hệ thống kiểm tra variant phải active.
- Không cho phép `quantity` trong cart vượt quá tồn kho khả dụng của variant tại store đã chọn.
- Response giỏ hàng populate `product`, `variant` và `images` để frontend hiển thị đầy đủ.
