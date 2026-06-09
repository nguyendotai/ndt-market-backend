# Module Xác Thực Và Người Dùng

Module Auth và User cung cấp nền tảng xác thực cho khách hàng, nhân viên và quản trị viên trong backend siêu thị online.

## Model người dùng

`src/modules/users/users.model.ts` định nghĩa schema người dùng với các trường:

- `fullName`
- `phone`
- `email`
- `password`
- `avatar`
- `role`: `CUSTOMER`, `ADMIN`, `STAFF`, `SHIPPER`, `SUPER_ADMIN`
- `status`: `ACTIVE`, `BLOCKED`
- `membershipTier`
- `totalPoints`
- timestamps

Mật khẩu được hash bằng `bcryptjs` trước khi lưu và không được trả về trong JSON/object response.

## API xác thực

Tất cả route xác thực được mount dưới `/api/v1/auth`.

- `POST /register`: Tạo tài khoản khách hàng và trả về access token.
- `POST /login`: Kiểm tra thông tin đăng nhập và trả về access token.
- `GET /me`: Trả về thông tin người dùng đang đăng nhập.
- `POST /logout`: Trả về xác nhận đăng xuất cho client dùng token.
- `PATCH /change-password`: Đổi mật khẩu của người dùng đang đăng nhập.

Body đăng ký yêu cầu:

- `fullName`
- `email`
- `password`
- `confirmPassword`
- `phone` tùy chọn
- `avatar` tùy chọn

`confirmPassword` phải trùng với `password` và không được lưu vào database.

## Middleware xác thực

`authMiddleware` kiểm tra JWT access token, tải người dùng đang hoạt động và gắn vào `req.user`.

`authorizeRoles(...roles)` giới hạn route theo các role được phép truy cập.
