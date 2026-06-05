# Backend Architecture

The backend now follows a clean architecture/module-based layout for the online supermarket domain.

## Route mounting

All module routes are collected in `src/routes/index.ts` and mounted by `src/app.ts` at `/api/v1`.

Example:

```text
GET /api/v1/products
GET /api/v1/orders
GET /api/v1/admin
```

Each current module exposes a basic `GET /` endpoint that returns a readiness response. These endpoints are placeholders for future business APIs.

## Module responsibilities

- `*.model.ts`: Database schema/model or domain type.
- `*.validation.ts`: Request validation schemas.
- `*.service.ts`: Business logic and data access coordination.
- `*.controller.ts`: HTTP request/response handling.
- `*.route.ts`: Express route definitions.

## Documentation rule

Whenever a feature is added or changed, update an existing file or create a new file inside `src/md`.
