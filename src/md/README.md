# Tài Liệu Backend NDT Market

Thư mục này lưu tài liệu mô tả chức năng backend cho website siêu thị online.

## Quy ước cập nhật

- Khi thêm module hoặc API mới, tạo hoặc cập nhật file `.md` tương ứng trong thư mục này.
- Khi thay đổi logic, request, response, middleware hoặc validation của một chức năng, cập nhật tài liệu liên quan.
- Nếu thay đổi có ảnh hưởng đến frontend, ghi rõ endpoint, payload và response để frontend dễ tích hợp.

## Tài liệu hiện có

- `project-overview.md`: Tổng quan dự án, tech stack và cấu trúc module.
- `backend-architecture.md`: Kiến trúc backend, route mounting và utility dùng chung.
- `auth-user.md`: Module xác thực và người dùng.
- `customer-modules.md`: Địa chỉ người dùng, hạng thành viên và điểm tích lũy.
- `catalog-modules.md`: Danh mục và thương hiệu.
- `product-module.md`: Sản phẩm, biến thể và hình ảnh sản phẩm.
- `store-inventory-module.md`: Cửa hàng, tồn kho và lịch sử biến động kho.
- `cart-module.md`: Giỏ hàng của khách hàng.
- `health-api.md`: API kiểm tra trạng thái server.
- `database.md`: Kết nối MongoDB bằng Mongoose.
- `error-handling.md`: Global error handler và định dạng lỗi.
