# Module Upload Ảnh

Module upload ảnh dùng `multer` để lưu file local vào thư mục `/uploads`.

## API

- `POST /api/v1/uploads/image`: Upload một ảnh.

Request dạng `multipart/form-data`:

- `image`: File ảnh.
- `folder`: `product`, `banner`, `article`, hoặc `avatar`.

## Quy tắc upload

- Chỉ cho phép file `jpg`, `jpeg`, `png`, `webp`.
- Dung lượng tối đa là `5MB`.
- File được lưu local vào `/uploads/<folder>`.
- Backend serve static tại `/uploads`.
- Response trả về `imageUrl`.

## Phân quyền

- Admin được upload ảnh `product`, `banner`, `article`.
- Customer được upload `avatar`.
- Route yêu cầu đăng nhập.
