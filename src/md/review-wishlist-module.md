# Module Đánh Giá Và Wishlist

Module Review và Wishlist quản lý đánh giá sản phẩm và danh sách yêu thích của khách hàng.

## Review model

Model review gồm:

- `user`
- `product`
- `order`
- `rating`
- `comment`
- `images`
- `status`: `PENDING`, `APPROVED`, `REJECTED`

## Wishlist model

Model wishlist gồm:

- `user`
- `product`

Mỗi user chỉ có một wishlist item cho một product.

## API Review

API public/khách hàng:

- `GET /api/v1/products/:slug/reviews`: Lấy danh sách review đã approved của sản phẩm.
- `POST /api/v1/products/:productId/reviews`: Tạo review cho sản phẩm.

API quản trị:

- `PATCH /api/v1/admin/reviews/:id/status`: Duyệt hoặc từ chối review.

## API Wishlist

Tất cả route wishlist yêu cầu đăng nhập.

- `GET /api/v1/wishlist`: Lấy danh sách sản phẩm yêu thích.
- `POST /api/v1/wishlist/:productId`: Thêm sản phẩm vào wishlist.
- `DELETE /api/v1/wishlist/:productId`: Xóa sản phẩm khỏi wishlist.

## Quy tắc nghiệp vụ

- User chỉ được review sản phẩm đã mua trong order có trạng thái `COMPLETED`.
- Mỗi user chỉ được review một sản phẩm một lần trên cùng một order.
- Review mới tạo có trạng thái `PENDING`.
- Public review chỉ trả các review có trạng thái `APPROVED`.
- Khi admin chuyển review sang `APPROVED`, hệ thống tính lại `ratingAverage` và `ratingCount` của product.
- Khi admin chuyển review sang `REJECTED`, hệ thống cũng tính lại rating để loại review đó khỏi điểm trung bình.
