# Kiến Trúc Backend

Backend đang dùng cấu trúc clean architecture/module-based cho hệ thống siêu thị online.

## Mount route

Tất cả route của module được gom tại `src/routes/index.ts` và được `src/app.ts` mount vào `/api/v1`.

Ví dụ:

```text
GET /api/v1/products
GET /api/v1/orders
GET /api/v1/admin
```

Mỗi module chịu trách nhiệm cho một nhóm nghiệp vụ riêng. Các endpoint cơ bản ban đầu có thể dùng để kiểm tra module đã được mount đúng.

## Trách nhiệm của từng file trong module

- `*.model.ts`: Schema/model database hoặc type/domain model.
- `*.validation.ts`: Schema validate request.
- `*.service.ts`: Xử lý nghiệp vụ và điều phối truy cập dữ liệu.
- `*.controller.ts`: Xử lý request/response HTTP.
- `*.route.ts`: Khai báo route Express.

## Utility API dùng chung

- `ApiResponse`: Chuẩn hóa response thành công với `success`, `message`, `data` và `meta` tùy chọn.
- `ApiError`: Đại diện cho lỗi nghiệp vụ với `statusCode`, `message` và `isOperational`.
- `catchAsync`: Chuyển lỗi từ async controller đến global error handler.
- `validate`: Dùng Zod để validate `body`, `params` và `query`.
- `errorHandler`: Trả về response lỗi thống nhất với `success: false`, `message` và `errors` tùy chọn.
- `notFoundHandler`: Trả về response `404` thống nhất cho route không tồn tại.
- `logger`: Tập trung logging bằng Winston.
- `env`: Validate biến môi trường bắt buộc trước khi server khởi động.

## Quy định tài liệu

Khi thêm mới hoặc thay đổi chức năng, phải cập nhật file hiện có hoặc tạo file mới trong `src/md`.
