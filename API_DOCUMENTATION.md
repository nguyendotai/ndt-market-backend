# API Documentation - NDT Market Backend

Base URL: `/api/v1`

Response chuẩn:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Lỗi chuẩn:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

Auth header cho API cần đăng nhập:

```http
Authorization: Bearer <accessToken>
```

Quy ước role admin:

- API `/admin/*` yêu cầu đăng nhập và role `ADMIN`, `STAFF`, hoặc `SUPER_ADMIN`.
- `SUPER_ADMIN` có toàn quyền.
- `ADMIN` và `STAFF` cần permission theo từng module.

## Auth

### Register

- Method: `POST`
- URL: `/auth/register`
- Auth required: Không
- Role required: Không
- Query params: Không
- Request body:

```json
{
  "email": "customer@example.com",
  "password": "Customer@123",
  "confirmPassword": "Customer@123"
}
```

Optional fields:

```json
{
  "fullName": "Nguyen Van A",
  "phone": "0900000001",
  "avatar": "https://res.cloudinary.com/demo/avatar.jpg"
}
```

Ghi chú: key chuẩn là `confirmPassword`; backend cũng hỗ trợ alias `confirmpassword` và `confirm_password` khi test bằng Postman.

- Response example:

```json
{
  "success": true,
  "message": "Register successfully",
  "data": {
    "user": {
      "_id": "665f00000000000000000001",
      "fullName": "Nguyen Van A",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt.token"
  }
}
```

### Login

- Method: `POST`
- URL: `/auth/login`
- Auth required: Không
- Role required: Không
- Query params: Không
- Request body:

```json
{
  "email": "customer@example.com",
  "password": "Customer@123"
}
```

- Response example:

```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "user": {
      "_id": "665f00000000000000000001",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt.token"
  }
}
```

### Get Me

- Method: `GET`
- URL: `/auth/me`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Request body: Không
- Query params: Không
- Response example:

```json
{
  "success": true,
  "message": "Get profile successfully",
  "data": {
    "user": {
      "_id": "665f00000000000000000001",
      "fullName": "Nguyen Van A",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Logout

- Method: `POST`
- URL: `/auth/logout`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Request body: Không
- Query params: Không
- Response example:

```json
{
  "success": true,
  "message": "Logout successfully",
  "data": null
}
```

### Change Password

- Method: `PATCH`
- URL: `/auth/change-password`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Query params: Không
- Request body:

```json
{
  "currentPassword": "Customer@123",
  "newPassword": "Customer@456"
}
```

- Response example:

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

## User Address

## User Management

Các API này dùng cho admin quản lý khách hàng và nhân viên.

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/admin/users` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | `keyword?`, `search?`, `role?`, `status?`, `page?`, `limit?` | `{"success":true,"data":[{"_id":"...","fullName":"Nguyen Van A","email":"a@example.com","role":"CUSTOMER","status":"ACTIVE"}],"meta":{"page":1,"limit":20,"total":1,"totalPages":1}}` |
| `GET` | `/admin/users/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":{"_id":"...","fullName":"Nguyen Van A","email":"a@example.com","role":"CUSTOMER","status":"ACTIVE"}}` |
| `PATCH` | `/admin/users/:id/status` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | `{ "status": "BLOCKED" }` | Không | `{"success":true,"data":{"_id":"...","status":"BLOCKED"}}` |
| `PATCH` | `/admin/users/:id/role` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | `{ "role": "STAFF", "permissions": ["catalog.manage", "orders.manage"] }` | Không | `{"success":true,"data":{"_id":"...","role":"STAFF","permissions":["catalog.manage","orders.manage"]}}` |

## User Address

### Get My Addresses

- Method: `GET`
- URL: `/user-addresses`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Request body: Không
- Query params: Không
- Response example:

```json
{
  "success": true,
  "message": "Get addresses successfully",
  "data": [
    {
      "_id": "665f00000000000000000010",
      "receiverName": "Nguyen Van A",
      "phone": "0900000001",
      "province": "Ho Chi Minh",
      "district": "Quan 1",
      "ward": "Ben Nghe",
      "addressDetail": "12 Le Loi",
      "isDefault": true
    }
  ]
}
```

### Create My Address

- Method: `POST`
- URL: `/user-addresses`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Query params: Không
- Request body:

```json
{
  "receiverName": "Nguyen Van A",
  "phone": "0900000001",
  "province": "Ho Chi Minh",
  "district": "Quan 1",
  "ward": "Ben Nghe",
  "addressDetail": "12 Le Loi",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "isDefault": true
}
```

- Response example:

```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "_id": "665f00000000000000000010",
    "receiverName": "Nguyen Van A",
    "isDefault": true
  }
}
```

### Update My Address

- Method: `PATCH`
- URL: `/user-addresses/:id`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Query params: Không
- Request body: Một hoặc nhiều field của địa chỉ.
- Response example:

```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "_id": "665f00000000000000000010",
    "addressDetail": "99 Nguyen Hue"
  }
}
```

### Delete My Address

- Method: `DELETE`
- URL: `/user-addresses/:id`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Request body: Không
- Query params: Không
- Response example:

```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": null
}
```

### Set My Default Address

- Method: `PATCH`
- URL: `/user-addresses/:id/default`
- Auth required: Có
- Role required: Người dùng đã đăng nhập
- Request body: Không
- Query params: Không
- Response example:

```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": {
    "_id": "665f00000000000000000010",
    "isDefault": true
  }
}
```

### Admin User Address APIs

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/admin/user-addresses` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | `userId?` | `{"success":true,"data":[{"_id":"...","user":"..."}]}` |
| `POST` | `/admin/user-addresses` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | `{ "user": "...", "receiverName": "...", "phone": "...", "province": "...", "district": "...", "ward": "...", "addressDetail": "...", "isDefault": true }` | Không | `{"success":true,"data":{"_id":"...","user":"..."}}` |
| `PATCH` | `/admin/user-addresses/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Một hoặc nhiều field địa chỉ | Không | `{"success":true,"data":{"_id":"..."}}` |
| `DELETE` | `/admin/user-addresses/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":null}` |
| `PATCH` | `/admin/user-addresses/:id/default` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":{"_id":"...","isDefault":true}}` |

## Category

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/categories` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Rau củ","slug":"rau-cu","image":"https://res.cloudinary.com/..."}]}` |
| `GET` | `/categories/tree` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Rau củ","children":[]}]}` |
| `GET` | `/categories/:slug` | Không | Không | Không | Không | `{"success":true,"data":{"_id":"...","name":"Rau củ","slug":"rau-cu"}}` |
| `POST` | `/admin/categories` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | `{ "parent": null, "name": "Rau củ", "image": "https://res.cloudinary.com/...", "sortOrder": 1, "isActive": true }` | Không | `{"success":true,"data":{"_id":"...","slug":"rau-cu"}}` |
| `PATCH` | `/admin/categories/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Một hoặc nhiều field category | Không | `{"success":true,"data":{"_id":"...","name":"Rau củ quả"}}` |
| `DELETE` | `/admin/categories/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Không | Không | `{"success":true,"data":null}` |

## Brand

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/brands` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Vinamilk","slug":"vinamilk","logo":"https://res.cloudinary.com/..."}]}` |
| `GET` | `/brands/:slug` | Không | Không | Không | Không | `{"success":true,"data":{"_id":"...","name":"Vinamilk","slug":"vinamilk"}}` |
| `POST` | `/admin/brands` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | `{ "name": "Vinamilk", "logo": "https://res.cloudinary.com/...", "description": "Brand description", "isActive": true }` | Không | `{"success":true,"data":{"_id":"...","slug":"vinamilk"}}` |
| `PATCH` | `/admin/brands/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Một hoặc nhiều field brand | Không | `{"success":true,"data":{"_id":"...","name":"Vinamilk"}}` |
| `DELETE` | `/admin/brands/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Không | Không | `{"success":true,"data":null}` |

## Product

### Public Product APIs

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/products` | Không | Không | Không | `keyword?`, `category?`, `brand?`, `minPrice?`, `maxPrice?`, `origin?`, `tags?`, `rating?`, `inStock?`, `storeId?`, `sort?`, `page?`, `limit?` | `{"success":true,"data":[{"_id":"...","name":"Rau muống","variants":[],"images":[]}],"meta":{"page":1,"limit":10,"total":50,"totalPages":5}}` |
| `GET` | `/products/:slug` | Không | Không | Không | Không | `{"success":true,"data":{"_id":"...","name":"Rau muống","category":{},"brand":{},"variants":[],"images":[]}}` |
| `GET` | `/products/:slug/related` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Sản phẩm liên quan"}]}` |
| `GET` | `/products/:variantId/inventory` | Không | Không | Không | `storeId?` | `{"success":true,"data":{"variant":"...","availableQuantity":20}}` |
| `GET` | `/products/:slug/reviews` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","rating":5,"comment":"Tốt"}]}` |
| `POST` | `/products/:productId/reviews` | Có | Người dùng đã đăng nhập | `{ "order": "...", "rating": 5, "comment": "Tốt", "images": ["https://res.cloudinary.com/..."] }` | Không | `{"success":true,"data":{"_id":"...","status":"PENDING"}}` |

Sort hỗ trợ: `newest`, `oldest`, `price_asc`, `price_desc`, `best_selling`, `rating`, `sold_desc`, `rating_desc`.

### Admin Product APIs

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/admin/products` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | `{ "category": "...", "brand": "...", "name": "Rau muống", "sku": "optional-manual-sku", "description": "...", "shortDescription": "...", "unit": "gói", "origin": "Việt Nam", "ingredients": [], "storageInstruction": "...", "status": "ACTIVE", "tags": [] }` | Không | `{"success":true,"data":{"_id":"...","slug":"rau-muong","sku":"NDT-RAUMUONG-MABC1231"}}` |
| `PATCH` | `/admin/products/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Một hoặc nhiều field product | Không | `{"success":true,"data":{"_id":"...","name":"Rau muống mới"}}` |
| `DELETE` | `/admin/products/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Không | Không | `{"success":true,"data":null}` |
| `POST` | `/admin/products/:id/variants` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | `{ "name": "500g", "barcode": "optional-manual-barcode", "imageUrl": "https://res.cloudinary.com/...", "price": 25000, "salePrice": 22000, "weight": 500, "unit": "g", "status": "ACTIVE" }` | Không | `{"success":true,"data":{"_id":"...","product":"...","barcode":"8931234567891","imageUrl":"https://res.cloudinary.com/..."}}` |
| `PATCH` | `/admin/products/variants/:variantId` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Một hoặc nhiều field variant | Không | `{"success":true,"data":{"_id":"...","price":24000}}` |
| `DELETE` | `/admin/products/variants/:variantId` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Không | Không | `{"success":true,"data":null}` |
| `POST` | `/admin/products/:id/images` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | `{ "imageUrl": "https://res.cloudinary.com/...", "isThumbnail": true, "sortOrder": 1 }` | Không | `{"success":true,"data":{"_id":"...","imageUrl":"https://res.cloudinary.com/..."}}` |
| `DELETE` | `/admin/products/images/:imageId` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `catalog.manage` | Không | Không | `{"success":true,"data":null}` |

## Store

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/stores` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"NDT Market Quận 1","status":"ACTIVE"}]}` |
| `GET` | `/stores/nearby` | Không | Không | Không | `latitude`, `longitude`, `radiusKm?` | `{"success":true,"data":[{"_id":"...","name":"NDT Market Quận 1","distanceKm":1.2}]}` |
| `POST` | `/admin/stores` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `stores.manage` | `{ "name": "NDT Market", "phone": "02811110001", "province": "Ho Chi Minh", "district": "Quan 1", "ward": "Ben Nghe", "address": "12 Le Loi", "latitude": 10.7769, "longitude": 106.7009, "openingHours": "07:00-22:00", "status": "ACTIVE" }` | Không | `{"success":true,"data":{"_id":"...","name":"NDT Market"}}` |
| `PATCH` | `/admin/stores/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `stores.manage` | Một hoặc nhiều field store | Không | `{"success":true,"data":{"_id":"...","status":"ACTIVE"}}` |
| `DELETE` | `/admin/stores/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `stores.manage` | Không | Không | `{"success":true,"data":null}` |

## Inventory

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/admin/inventories` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | Không | `storeId?`, `variantId?`, `keyword?`, `search?`, `lowStock?` | `{"success":true,"data":[{"_id":"...","productName":"Rau muống sạch","productSku":"NDT-RAU-MUONG-001","variantName":"500g","barcode":"893...","storeName":"NDT Market Quận 1","quantity":50,"reservedQuantity":3,"availableQuantity":47,"stockStatus":"IN_STOCK"}]}` |
| `GET` | `/admin/inventories/movements` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | Không | `storeId?`, `variantId?`, `type?`, `keyword?`, `search?` | `{"success":true,"data":[{"_id":"...","productName":"Rau muống sạch","variantName":"500g","storeName":"NDT Market Quận 1","type":"IMPORT","quantity":20,"reason":"Nhập hàng"}]}` |
| `PATCH` | `/admin/inventories/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | `{ "quantity": 50, "reservedQuantity": 2 }` | Không | `{"success":true,"data":{"_id":"...","availableQuantity":48}}` |
| `POST` | `/admin/inventories/import` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | `{ "store": "...", "variant": "...", "quantity": 20, "reason": "Nhập hàng" }` | Không | `{"success":true,"data":{"inventory":{"_id":"..."},"movement":{"type":"IMPORT"}}}` |
| `POST` | `/admin/inventories/adjust` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | `{ "store": "...", "variant": "...", "quantity": -5, "reason": "Kiểm kho" }` | Không | `{"success":true,"data":{"inventory":{"_id":"..."},"movement":{"type":"ADJUST"}}}` |
| `POST` | `/admin/inventories/reserve` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | `{ "store": "...", "variant": "...", "quantity": 1, "reason": "Reserve order" }` | Không | `{"success":true,"data":{"_id":"...","reservedQuantity":1}}` |
| `POST` | `/admin/inventories/release` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `inventory.manage` | `{ "store": "...", "variant": "...", "quantity": 1, "reason": "Cancel order" }` | Không | `{"success":true,"data":{"_id":"...","reservedQuantity":0}}` |

## Cart

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/cart` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":{"_id":"...","store":"...","items":[]}}` |
| `POST` | `/cart/items` | Có | Người dùng đã đăng nhập | `{ "variant": "...", "quantity": 2 }` | Không | `{"success":true,"data":{"_id":"...","items":[{"variant":"...","quantity":2}]}}` |
| `PATCH` | `/cart/items/:itemId` | Có | Người dùng đã đăng nhập | `{ "quantity": 3 }` | Không | `{"success":true,"data":{"_id":"...","quantity":3}}` |
| `DELETE` | `/cart/items/:itemId` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":null}` |
| `DELETE` | `/cart/clear` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":null}` |
| `PATCH` | `/cart/store` | Có | Người dùng đã đăng nhập | `{ "store": "665f00000000000000000020" }` | Không | `{"success":true,"data":{"_id":"...","store":"..."}}` |

## Order

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/checkout` | Có | Người dùng đã đăng nhập | `{ "deliveryType": "DELIVERY", "address": { "receiverName": "Nguyen Van A", "phone": "0900000001", "province": "Ho Chi Minh", "district": "Quan 1", "ward": "Ben Nghe", "addressDetail": "12 Le Loi" }, "timeSlot": "...", "shippingFee": 20000, "discountTotal": 10000, "note": "Giao giờ hành chính" }` | Không | `{"success":true,"data":{"orderCode":"ORD202606090001","status":"PENDING","total":120000}}` |
| `GET` | `/orders` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":[{"orderCode":"ORD202606090001","status":"PENDING"}]}` |
| `GET` | `/orders/:orderCode` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":{"orderCode":"ORD202606090001","items":[]}}` |
| `PATCH` | `/orders/:orderCode/cancel` | Có | Người dùng đã đăng nhập | `{ "note": "Đổi ý" }` | Không | `{"success":true,"data":{"orderCode":"ORD202606090001","status":"CANCELLED"}}` |
| `GET` | `/admin/orders` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `orders.manage` | Không | `status?`, `paymentStatus?`, `userId?`, `storeId?` | `{"success":true,"data":[{"_id":"...","orderCode":"ORD202606090001"}]}` |
| `GET` | `/admin/orders/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `orders.manage` | Không | Không | `{"success":true,"data":{"_id":"...","orderCode":"ORD202606090001","items":[]}}` |
| `PATCH` | `/admin/orders/:id/status` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `orders.manage` | `{ "status": "CONFIRMED", "note": "Đã xác nhận" }` | Không | `{"success":true,"data":{"_id":"...","status":"CONFIRMED"}}` |

## Payment

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/payments/:orderCode/create` | Có | Người dùng đã đăng nhập | `{ "method": "COD", "transactionCode": "optional" }` | Không | `{"success":true,"data":{"_id":"...","method":"COD","status":"PENDING"}}` |
| `GET` | `/payments/:orderCode` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":{"_id":"...","order":"...","status":"PENDING"}}` |
| `POST` | `/payments/webhook/momo` | Không | Không | Payload webhook bất kỳ | Không | `{"success":true,"data":{"received":true}}` |
| `POST` | `/payments/webhook/vnpay` | Không | Không | Payload webhook bất kỳ | Không | `{"success":true,"data":{"received":true}}` |
| `PATCH` | `/admin/payments/:id/confirm` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `payments.manage` | `{ "transactionCode": "BANK123", "rawResponse": {} }` | Không | `{"success":true,"data":{"_id":"...","status":"PAID"}}` |
| `PATCH` | `/admin/payments/:id/refund` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `payments.manage` | `{ "reason": "Hoàn tiền", "rawResponse": {} }` | Không | `{"success":true,"data":{"_id":"...","status":"REFUNDED"}}` |

## Delivery

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/delivery/time-slots` | Không | Không | Không | `storeId`, `date` định dạng `YYYY-MM-DD` | `{"success":true,"data":[{"_id":"...","startTime":"2026-06-09T08:00:00.000Z","endTime":"2026-06-09T10:00:00.000Z","maxOrders":10,"currentOrders":2}]}` |
| `POST` | `/admin/delivery/time-slots` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `delivery.manage` | `{ "store": "...", "startTime": "2026-06-09T08:00:00.000Z", "endTime": "2026-06-09T10:00:00.000Z", "maxOrders": 10, "currentOrders": 0, "isActive": true }` | Không | `{"success":true,"data":{"_id":"...","maxOrders":10}}` |
| `PATCH` | `/admin/delivery/time-slots/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `delivery.manage` | Một hoặc nhiều field time slot | Không | `{"success":true,"data":{"_id":"...","isActive":true}}` |
| `POST` | `/admin/shipments/:orderId/assign` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `delivery.manage` | `{ "shipper": "...", "shippingPartner": "NDT Express", "trackingCode": "TRK001", "note": "Giao nhanh" }` | Không | `{"success":true,"data":{"_id":"...","status":"ASSIGNED"}}` |
| `GET` | `/shipper/shipments` | Có | `SHIPPER` | Không | `status?` | `{"success":true,"data":[{"_id":"...","status":"ASSIGNED"}]}` |
| `PATCH` | `/shipper/shipments/:id/status` | Có | `SHIPPER` | `{ "status": "DELIVERING", "note": "Đang giao" }` | Không | `{"success":true,"data":{"_id":"...","status":"DELIVERING"}}` |

## Promotion

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/promotions` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Khuyến mãi hè","status":"ACTIVE"}]}` |
| `POST` | `/admin/promotions` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | `{ "name": "Khuyến mãi hè", "type": "ORDER_DISCOUNT", "discountType": "PERCENT", "discountValue": 10, "minOrderValue": 100000, "maxDiscount": 30000, "startDate": "2026-06-09T00:00:00.000Z", "endDate": "2026-07-09T00:00:00.000Z", "status": "ACTIVE", "variants": [] }` | Không | `{"success":true,"data":{"_id":"...","name":"Khuyến mãi hè"}}` |
| `PATCH` | `/admin/promotions/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | Một hoặc nhiều field promotion | Không | `{"success":true,"data":{"_id":"...","status":"ACTIVE"}}` |
| `DELETE` | `/admin/promotions/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | Không | Không | `{"success":true,"data":null}` |

## Coupon

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/coupons/apply` | Có | Người dùng đã đăng nhập | `{ "code": "WELCOME10", "orderValue": 200000 }` | Không | `{"success":true,"data":{"code":"WELCOME10","discountAmount":20000}}` |
| `GET` | `/admin/coupons` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | Không | Không | `{"success":true,"data":[{"_id":"...","code":"WELCOME10"}]}` |
| `POST` | `/admin/coupons` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | `{ "code": "WELCOME10", "discountType": "PERCENT", "discountValue": 10, "minOrderValue": 100000, "maxDiscount": 30000, "usageLimit": 100, "userLimit": 1, "expiredAt": "2026-07-09T00:00:00.000Z", "status": "ACTIVE" }` | Không | `{"success":true,"data":{"_id":"...","code":"WELCOME10"}}` |
| `PATCH` | `/admin/coupons/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | Một hoặc nhiều field coupon | Không | `{"success":true,"data":{"_id":"...","status":"ACTIVE"}}` |
| `DELETE` | `/admin/coupons/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `marketing.manage` | Không | Không | `{"success":true,"data":null}` |

## Review

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/products/:slug/reviews` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","rating":5,"comment":"Tốt","status":"APPROVED"}]}` |
| `POST` | `/products/:productId/reviews` | Có | Người dùng đã đăng nhập | `{ "order": "...", "rating": 5, "comment": "Tốt", "images": ["https://res.cloudinary.com/..."] }` | Không | `{"success":true,"data":{"_id":"...","status":"PENDING"}}` |
| `PATCH` | `/admin/reviews/:id/status` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `reviews.manage` | `{ "status": "APPROVED" }` hoặc `{ "status": "REJECTED" }` | Không | `{"success":true,"data":{"_id":"...","status":"APPROVED"}}` |

## Wishlist

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/wishlist` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":[{"_id":"...","product":{"_id":"...","name":"Rau muống"}}]}` |
| `POST` | `/wishlist/:productId` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":{"_id":"...","product":"..."}}` |
| `DELETE` | `/wishlist/:productId` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":null}` |

## CMS

### Banner

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/banners` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","title":"Banner top","imageUrl":"https://res.cloudinary.com/...","position":"HOME_TOP"}]}` |
| `POST` | `/admin/banners` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | `{ "title": "Banner top", "imageUrl": "https://res.cloudinary.com/...", "linkUrl": "https://example.com", "position": "HOME_TOP", "startDate": "2026-06-09T00:00:00.000Z", "endDate": "2026-07-09T00:00:00.000Z", "status": "ACTIVE", "sortOrder": 1 }` | Không | `{"success":true,"data":{"_id":"...","title":"Banner top"}}` |
| `PATCH` | `/admin/banners/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | Một hoặc nhiều field banner | Không | `{"success":true,"data":{"_id":"...","status":"ACTIVE"}}` |
| `DELETE` | `/admin/banners/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | Không | Không | `{"success":true,"data":null}` |

### Article

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/articles` | Không | Không | Không | Không | `{"success":true,"data":[{"_id":"...","title":"Tin khuyến mãi","slug":"tin-khuyen-mai"}]}` |
| `GET` | `/articles/:slug` | Không | Không | Không | Không | `{"success":true,"data":{"_id":"...","title":"Tin khuyến mãi","content":"..."}}` |
| `POST` | `/admin/article-categories` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | `{ "name": "Tin tức" }` | Không | `{"success":true,"data":{"_id":"...","slug":"tin-tuc"}}` |
| `POST` | `/admin/articles` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | `{ "title": "Tin khuyến mãi", "thumbnail": "https://res.cloudinary.com/...", "content": "Nội dung", "excerpt": "Tóm tắt", "category": "...", "status": "PUBLISHED", "publishedAt": "2026-06-09T00:00:00.000Z" }` | Không | `{"success":true,"data":{"_id":"...","slug":"tin-khuyen-mai"}}` |
| `PATCH` | `/admin/articles/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | Một hoặc nhiều field article | Không | `{"success":true,"data":{"_id":"...","status":"PUBLISHED"}}` |
| `DELETE` | `/admin/articles/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `cms.manage` | Không | Không | `{"success":true,"data":null}` |

## Admin RBAC

Tất cả API trong nhóm này yêu cầu role `SUPER_ADMIN`.

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/admin/roles` | Có | `SUPER_ADMIN` | Không | Không | `{"success":true,"data":[{"_id":"...","name":"Catalog Manager"}]}` |
| `POST` | `/admin/roles` | Có | `SUPER_ADMIN` | `{ "name": "Catalog Manager", "description": "Quản lý catalog" }` | Không | `{"success":true,"data":{"_id":"...","name":"Catalog Manager"}}` |
| `PATCH` | `/admin/roles/:id` | Có | `SUPER_ADMIN` | `{ "name": "Catalog Staff", "description": "Quản lý danh mục" }` | Không | `{"success":true,"data":{"_id":"...","name":"Catalog Staff"}}` |
| `DELETE` | `/admin/roles/:id` | Có | `SUPER_ADMIN` | Không | Không | `{"success":true,"data":null}` |
| `GET` | `/admin/permissions` | Có | `SUPER_ADMIN` | Không | Không | `{"success":true,"data":[{"_id":"...","key":"catalog.manage","group":"catalog"}]}` |
| `POST` | `/admin/permissions` | Có | `SUPER_ADMIN` | `{ "name": "Manage Catalog", "key": "catalog.manage", "group": "catalog" }` | Không | `{"success":true,"data":{"_id":"...","key":"catalog.manage"}}` |
| `POST` | `/admin/roles/:id/permissions` | Có | `SUPER_ADMIN` | `{ "permissionIds": ["665f00000000000000000030"] }` | Không | `{"success":true,"data":[{"role":"...","permission":"..."}]}` |
| `DELETE` | `/admin/roles/:id/permissions/:permissionId` | Có | `SUPER_ADMIN` | Không | Không | `{"success":true,"data":null}` |

## Upload

API upload dùng để lấy URL Cloudinary cho các field ảnh của category, brand, product, banner, article, avatar và review.

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `POST` | `/uploads/image` | Có | Admin/Super Admin cho `product`, `category`, `brand`, `banner`, `article`; user đăng nhập cho `avatar`, `review` | `multipart/form-data`: `image=<file>`, `folder=product/category/brand/banner/article/avatar/review` | Không | `{"success":true,"data":{"imageUrl":"https://res.cloudinary.com/.../image/upload/..."}}` |

## Customer Extra APIs

### Membership Tier

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/admin/membership-tiers` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":[{"_id":"...","name":"GOLD"}]}` |
| `GET` | `/admin/membership-tiers/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":{"_id":"...","name":"GOLD"}}` |
| `POST` | `/admin/membership-tiers` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | `{ "name": "GOLD", "minPoint": 5000, "discountPercent": 5, "benefits": ["Ưu đãi"], "status": "ACTIVE" }` | Không | `{"success":true,"data":{"_id":"...","name":"GOLD"}}` |
| `PATCH` | `/admin/membership-tiers/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Một hoặc nhiều field membership tier | Không | `{"success":true,"data":{"_id":"...","discountPercent":5}}` |
| `DELETE` | `/admin/membership-tiers/:id` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | Không | `{"success":true,"data":null}` |

### Loyalty Point

| Method | URL | Auth required | Role required | Request body | Query params | Response example |
| --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/loyalty-points/me` | Có | Người dùng đã đăng nhập | Không | Không | `{"success":true,"data":[{"_id":"...","points":100,"type":"EARN"}]}` |
| `GET` | `/admin/loyalty-points` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | Không | `userId?`, `type?` | `{"success":true,"data":[{"_id":"...","user":"...","points":100}]}` |
| `POST` | `/admin/loyalty-points/adjust` | Có | `ADMIN/STAFF/SUPER_ADMIN` + `customers.manage` | `{ "user": "...", "order": "...", "points": 100, "type": "ADJUST", "note": "Cộng điểm thủ công" }` | Không | `{"success":true,"data":{"_id":"...","points":100}}` |
