# Seed Data

Dự án có file seed tại `src/seed/seed.ts`.

## Chạy seed

```bash
npm run seed
```

## Dữ liệu được tạo

- 1 super admin.
- 3 store.
- 10 category cha/con.
- 10 brand.
- 50 product.
- Mỗi product có 1 đến 3 variant.
- Mỗi product có ảnh mẫu.
- Inventory cho từng store.
- 5 banner.
- 5 coupon.
- 3 membership tier.

## Tài khoản mặc định

- Email: `admin@ndtmarket.com`
- Password: `Admin@123`

## Lưu ý

Mỗi lần chạy seed sẽ xóa dữ liệu cũ ở các collection chính trước khi tạo dữ liệu mới.
