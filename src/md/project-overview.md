# Tổng Quan Dự Án

NDT Market backend là dịch vụ API cho website siêu thị online.

## Công nghệ sử dụng

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Auth
- Zod validation
- Winston logger
- Morgan
- CORS
- Helmet
- dotenv
- bcryptjs

## Cấu trúc chính

- `src/app.ts`: Tạo Express app, đăng ký middleware toàn cục và mount toàn bộ API route tại `/api/v1`.
- `src/server.ts`: Khởi động HTTP server và quản lý vòng đời kết nối MongoDB.
- `src/configs`: Cấu hình môi trường, database và logger.
- `src/constants`: Hằng số dùng chung như HTTP status, role, trạng thái đơn hàng và trạng thái thanh toán.
- `src/middlewares`: Middleware Express dùng chung cho auth, validation, error và not-found.
- `src/utils`: Helper dùng chung như `ApiError`, `ApiResponse`, `catchAsync`, tạo token và tạo slug.
- `src/modules`: Các module nghiệp vụ theo cấu trúc clean architecture/module-based.
- `src/routes`: Nơi gom route trung tâm cho các API module.
- `src/md`: Tài liệu dự án và tài liệu chức năng.

## Format module

Mỗi module dùng format file sau:

```text
module/
├── module.model.ts
├── module.validation.ts
├── module.service.ts
├── module.controller.ts
└── module.route.ts
```

## Module hiện có

- `auth`
- `users`
- `user-addresses`
- `membership-tiers`
- `loyalty-points`
- `categories`
- `brands`
- `products`
- `stores`
- `inventories`
- `carts`
- `orders`
- `payments`
- `promotions`
- `coupons`
- `reviews`
- `banners`
- `articles`
- `admin`

## Import alias

Dự án dùng alias `@/` trỏ đến thư mục `src`.

```ts
import { env } from "@/configs/env";
```
