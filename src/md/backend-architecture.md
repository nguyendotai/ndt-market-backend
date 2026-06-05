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

## Shared API utilities

- `ApiResponse` returns successful responses with `success`, `message`, `data`, and optional `meta`.
- `ApiError` represents operational errors with `statusCode`, `message`, and `isOperational`.
- `catchAsync` forwards rejected async controller promises to the global error handler.
- `validate` uses Zod schemas for `body`, `params`, and `query`.
- `errorHandler` returns failed responses with `success: false`, `message`, and optional `errors`.
- `notFoundHandler` returns a consistent 404 response for unknown routes.
- `logger` centralizes Winston console logging.
- `env` validates required environment variables before the server starts.

## Documentation rule

Whenever a feature is added or changed, update an existing file or create a new file inside `src/md`.
