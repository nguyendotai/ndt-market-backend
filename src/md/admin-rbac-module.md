# Module Phân Quyền Admin RBAC

Module Admin RBAC quản lý role, permission và quyền truy cập module trong khu vực admin.

## Role model

Model role gồm:

- `name`
- `description`

`name` được chuẩn hóa uppercase để khớp với role của user như `ADMIN`, `STAFF`, `SUPER_ADMIN`.

## Permission model

Model permission gồm:

- `name`
- `key`
- `group`

`key` được chuẩn hóa lowercase, ví dụ:

- `catalog.manage`
- `orders.manage`
- `inventory.manage`
- `cms.manage`

## RolePermission model

Model liên kết role và permission gồm:

- `role`
- `permission`

## User

User vẫn có field `role` như hiện tại:

- `CUSTOMER`
- `ADMIN`
- `STAFF`
- `SHIPPER`
- `SUPER_ADMIN`

User có thêm `permissions` tùy chọn để cấp quyền trực tiếp ngoài quyền lấy từ role.

## API quản trị RBAC

Các API này chỉ dành cho `SUPER_ADMIN`.

- `GET /api/v1/admin/roles`: Lấy danh sách role kèm permissions.
- `POST /api/v1/admin/roles`: Tạo role.
- `PATCH /api/v1/admin/roles/:id`: Cập nhật role.
- `DELETE /api/v1/admin/roles/:id`: Xóa role.
- `GET /api/v1/admin/permissions`: Lấy danh sách permission.
- `POST /api/v1/admin/permissions`: Tạo permission.
- `POST /api/v1/admin/roles/:id/permissions`: Gán permissions cho role.
- `DELETE /api/v1/admin/roles/:id/permissions/:permissionId`: Gỡ permission khỏi role.

## Middleware

- `authMiddleware`: Xác thực JWT và gắn user vào `req.user`.
- `authorizeRoles(...roles)`: Kiểm tra role.
- `authorizePermissions(...permissions)`: Kiểm tra permission theo role và permission trực tiếp của user.

## Quy tắc nghiệp vụ

- `SUPER_ADMIN` có toàn quyền và bỏ qua kiểm tra permission.
- `ADMIN` có quyền theo role `ADMIN` trong bảng RBAC hoặc permissions trực tiếp trên user.
- `STAFF` chỉ thao tác được module được cấp quyền.
- Các route admin module hiện dùng permission key theo nhóm, ví dụ `catalog.manage`, `orders.manage`, `payments.manage`, `cms.manage`.
