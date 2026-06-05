# Error Handling

Dự án có global error handler tại `src/middlewares/error.middleware.ts`.

## Các loại lỗi đang hỗ trợ

- `ZodError`: Trả về HTTP `400` với thông tin validation.
- `AppError`: Trả về status code và message được khai báo trong code.
- Lỗi không xác định: Trả về HTTP `500`.

## Response lỗi mẫu

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Ghi chú frontend

Frontend nên đọc field `success` và `message` để hiển thị trạng thái lỗi. Với lỗi validation, response có thêm field `errors`.
