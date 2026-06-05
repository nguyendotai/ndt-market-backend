# Auth And User Module

The Auth and User modules provide the foundation for customer and staff authentication in the online supermarket backend.

## User model

`src/modules/users/users.model.ts` defines the user schema with:

- `fullName`
- `phone`
- `email`
- `password`
- `avatar`
- `role`: `CUSTOMER`, `ADMIN`, `STAFF`, `SHIPPER`, `SUPER_ADMIN`
- `status`: `ACTIVE`, `BLOCKED`
- `membershipTier`
- `totalPoints`
- timestamps

Passwords are hashed with `bcryptjs` before saving and removed from JSON/object responses.

## Auth APIs

All auth routes are mounted under `/api/v1/auth`.

- `POST /register`: Creates a customer account and returns an access token.
- `POST /login`: Validates credentials and returns an access token.
- `GET /me`: Returns the authenticated user.
- `POST /logout`: Returns a logout acknowledgement for token-based clients.
- `PATCH /change-password`: Changes the authenticated user's password.

## Auth middleware

`authMiddleware` validates a JWT access token, loads the active user, and attaches it to `req.user`.

`authorizeRoles(...roles)` restricts routes to specific user roles.
