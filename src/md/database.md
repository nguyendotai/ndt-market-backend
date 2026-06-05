# Database

Dự án kết nối MongoDB bằng Mongoose.

## Biến môi trường

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ndt-market
```

## Luồng hoạt động

- `src/server.ts` gọi `connectMongoDB()` trước khi mở port server.
- Nếu kết nối MongoDB lỗi, server sẽ ghi log lỗi và dừng process.
- Khi nhận `SIGINT` hoặc `SIGTERM`, server đóng HTTP connection và ngắt kết nối MongoDB.
