# Kiến Trúc Backend

Backend dùng cấu trúc clean architecture/module-based cho hệ thống siêu thị online.

## Mount Route

Tất cả route của module được gom tại `src/routes/index.ts` và được `src/app.ts` mount vào `/api/v1`.

Ví dụ:

```text
GET /api/v1/products
GET /api/v1/orders
GET /api/v1/admin
```

Mỗi module chịu trách nhiệm cho một nhóm nghiệp vụ riêng.

## Body Parser

`src/app.ts` cấu hình:

- `express.json({ type: ["application/json", "text/plain"] })`
- `express.urlencoded({ extended: true })`

API JSON nên gửi header:

```http
Content-Type: application/json
```

Khi test bằng Postman, nếu raw body là JSON nhưng header bị gửi thành `text/plain`, backend vẫn cố gắng parse như JSON để tránh lỗi `body Required`.

## Validate Request

`validate.middleware.ts` dùng Zod để validate `body`, `params` và `query`.

Nếu request không có `body`, middleware sẽ dùng `{}` để Zod trả lỗi theo field cụ thể như `email`, `password`, `confirmPassword` thay vì lỗi chung `body Required`.

## Trách Nhiệm Của Từng File Trong Module

- `*.model.ts`: Schema/model database hoặc type/domain model.
- `*.validation.ts`: Schema validate request.
- `*.service.ts`: Xử lý nghiệp vụ và điều phối truy cập dữ liệu.
- `*.controller.ts`: Xử lý request/response HTTP.
- `*.route.ts`: Khai báo route Express.

## Utility API Dùng Chung

- `ApiResponse`: Chuẩn hóa response thành công với `success`, `message`, `data` và `meta` tùy chọn.
- `ApiError`: Đại diện cho lỗi nghiệp vụ với `statusCode`, `message` và `isOperational`.
- `catchAsync`: Chuyển lỗi từ async controller đến global error handler.
- `validate`: Dùng Zod để validate `body`, `params` và `query`.
- `errorHandler`: Trả về response lỗi thống nhất với `success: false`, `message` và `errors` tùy chọn.
- `notFoundHandler`: Trả về response `404` thống nhất cho route không tồn tại.
- `logger`: Tập trung logging bằng Winston.
- `env`: Validate biến môi trường bắt buộc trước khi server khởi động.

## Quy Định Tài Liệu

Khi thêm mới hoặc thay đổi chức năng, phải cập nhật file hiện có hoặc tạo file mới trong `src/md`.
