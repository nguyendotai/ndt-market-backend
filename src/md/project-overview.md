# Project Overview

NDT Market backend is the API service for an online supermarket website.

## Tech stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Auth
- Zod validation
- Winston logger
- Morgan
- CORS
- Helmet
- dotenv
- bcryptjs

## Main structure

- `src/app.ts`: Creates the Express app, registers global middleware, and mounts all API routes at `/api/v1`.
- `src/server.ts`: Starts the HTTP server and manages MongoDB connection lifecycle.
- `src/configs`: Environment, database, and logger configuration.
- `src/constants`: Shared constants such as HTTP status, roles, order status, and payment status.
- `src/middlewares`: Shared Express middlewares for auth, validation, errors, and not-found handling.
- `src/utils`: Shared helpers such as `ApiError`, `ApiResponse`, `catchAsync`, token generation, and slug creation.
- `src/modules`: Business modules using a clean architecture/module-based skeleton.
- `src/routes`: Central route aggregator for API modules.
- `src/md`: Project and feature documentation.

## Module format

Each module uses this file format:

```text
module/
├── module.model.ts
├── module.validation.ts
├── module.service.ts
├── module.controller.ts
└── module.route.ts
```

## Current modules

- `auth`
- `users`
- `categories`
- `brands`
- `products`
- `stores`
- `inventories`
- `carts`
- `orders`
- `payments`
- `promotions`
- `coupons`
- `reviews`
- `banners`
- `articles`
- `admin`

## Import alias

The project uses `@/` as an alias to `src`.

```ts
import { env } from "@/configs/env";
```
