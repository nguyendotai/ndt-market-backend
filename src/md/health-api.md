# Health API

## GET `/api/v1/health`

API dùng để kiểm tra server backend có đang chạy hay không.

### Response thành công

```json
{
  "success": true,
  "message": "NDT Market API is healthy",
  "data": {
    "uptime": 12.345,
    "timestamp": "2026-06-05T00:00:00.000Z"
  }
}
```

### Ghi chú frontend

Frontend có thể gọi endpoint này để kiểm tra trạng thái API trước khi hiển thị hoặc debug kết nối backend.
