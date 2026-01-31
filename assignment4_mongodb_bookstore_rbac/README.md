# Assignment 4 — Online Bookstore API (MongoDB + MVC + JWT + RBAC)

This project builds on Assignment 3 by refactoring into a modular MVC architecture and adding security:
- **Password hashing** with `bcrypt`
- **JWT authentication**
- **Role-Based Access Control (RBAC)**: only **admin** can Create/Update/Delete
- Two related objects: **Books (primary)** and **Orders (secondary)**

## Project Structure (MVC)
- `src/models/` — Mongoose schemas (Book, Order, User)
- `src/controllers/` — request handling logic
- `src/routes/` — API endpoints
- `src/middleware/` — validation, auth/RBAC, error handling/logging
- `src/config/` — MongoDB connection
- `public/` — simple HTML/JS interface (list + create)

## Requirements Mapping
- Public GET routes are open to everyone.
- POST/PUT/DELETE routes require a valid JWT **and** `role=admin`.

## Setup
1) Install dependencies:
```bash
npm install
```

2) Create `.env` from `.env.example` and set:
- `MONGODB_URI`
- `JWT_SECRET` (must be a long random string)

3) Run:
```bash
npm run dev
```

Open:
- Front page: `http://localhost:3000/`
- Health check: `http://localhost:3000/api/health`

## Auth (Register / Login)
### Register
`POST /api/auth/register`
```json
{
  "email": "admin@mail.com",
  "password": "Admin123!",
  "role": "admin"
}
```

> For demo/testing you can set `"role": "admin"` to create an admin account.
> In production you would NOT allow public role assignment.

### Login
`POST /api/auth/login`
```json
{
  "email": "admin@mail.com",
  "password": "Admin123!"
}
```

Response includes a `token`. Use it in requests:
`Authorization: Bearer <token>`

### Current user
`GET /api/auth/me` (requires login)

## Books API
- `GET /api/books` (public)
- `GET /api/books/:id` (public)
- `POST /api/books` (**admin only**)
- `PUT /api/books/:id` (**admin only**)
- `DELETE /api/books/:id` (**admin only**)

## Orders API
- `GET /api/orders` (public)
- `GET /api/orders/:id` (public)
- `POST /api/orders` (**admin only**)
- `PUT /api/orders/:id` (**admin only**)
- `DELETE /api/orders/:id` (**admin only**)

## Validation & Status Codes
- Uses Joi validation for all POST/PUT.
- Status codes:
  - `201` created
  - `400` bad request (validation / invalid id)
  - `401` unauthorized (missing/invalid token)
  - `403` forbidden (not admin)
  - `404` not found

## Postman
Import: `postman_collection_assignment4.json`
It contains examples showing:
- admin success for POST/PUT/DELETE
- user forbidden (403) for POST/PUT/DELETE
- public GET allowed without token
