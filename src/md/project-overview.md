# Project Overview

NDT Market backend là API cho website siêu thị online theo mô hình tương tự Kingfoodmart/Bách Hóa Xanh.

## Tech stack

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

- `src/app.ts`: Cấu hình Express app, middleware và routes.
- `src/server.ts`: Khởi động HTTP server và kết nối MongoDB.
- `src/configs`: Cấu hình env và database.
- `src/modules`: Các module nghiệp vụ.
- `src/middlewares`: Middleware dùng chung.
- `src/utils`: Tiện ích dùng chung.
- `src/validations`: Validation middleware/schema dùng chung.
- `src/types`: TypeScript types dùng chung.
- `src/constants`: Hằng số dùng chung.
- `src/md`: Tài liệu chức năng.

## Import alias

Dự án dùng alias `@/` trỏ tới thư mục `src`.

Ví dụ:

```ts
import { env } from "@/configs/env.config";
```
