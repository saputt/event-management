````md
# Event Management API

A REST API for managing organizers and events, built with **NestJS** and **TypeScript**.

The application provides JWT-based authentication, role-based authorization, PostgreSQL database integration using Prisma ORM, request validation, and end-to-end testing for authentication and authorization flows.

---

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Organizer management
- Event management
- Organizer–Event relationship
- Organizer status management
- Event visibility status
- PostgreSQL database
- Prisma ORM
- Request validation
- Protected API endpoints
- End-to-end authentication and authorization testing

---

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Programming language |
| PostgreSQL | Relational database |
| Prisma | ORM and database access |
| JWT / Passport | Authentication |
| bcrypt | Password hashing |
| Jest | Testing framework |
| Supertest | HTTP testing |

---

## Architecture

This project uses **Layered Architecture**.

```text
HTTP Request
     │
     ▼
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Prisma    │
└──────┬──────┘
       │
       ▼
  PostgreSQL
````

### Layer Responsibilities

**Controller**

Handles HTTP requests and responses, including request parameters, request bodies, and authentication/authorization guards.

**Service**

Contains application and business logic, such as ownership validation and coordinating operations between controllers and repositories.

**Repository**

Handles database operations through Prisma.

**Prisma**

Provides the ORM layer for interacting with PostgreSQL.

### Why Layered Architecture?

Layered Architecture was chosen to separate responsibilities between different parts of the application.

This keeps HTTP handling, business logic, and database access separated, making the code easier to understand, maintain, and extend.

---

## Database Design

The application uses **PostgreSQL** with **Prisma ORM**.

### Entity Relationship

```text
User
 │
 │ 1 : 0..1
 ▼
Organizer
 │
 │ 1 : N
 ▼
Event
```

### User

Stores authentication and user information.

| Field       | Description            |
| ----------- | ---------------------- |
| `id`        | Unique user identifier |
| `email`     | Unique user email      |
| `password`  | Hashed password        |
| `name`      | User name              |
| `role`      | `ORGANIZER` or `USER`  |
| `createdAt` | Creation timestamp     |
| `updatedAt` | Last update timestamp  |

### Organizer

Represents an organizer owned by a user.

| Field         | Description                    |
| ------------- | ------------------------------ |
| `id`          | Unique organizer identifier    |
| `name`        | Organizer name                 |
| `description` | Optional organizer description |
| `address`     | Optional organizer address     |
| `status`      | `ACTIVE` or `INACTIVE`         |
| `userId`      | Owner user ID                  |
| `createdAt`   | Creation timestamp             |
| `updatedAt`   | Last update timestamp          |

Each user can have at most one organizer because `userId` is unique.

### Event

Represents an event managed by an organizer.

| Field         | Description                   |
| ------------- | ----------------------------- |
| `id`          | Unique event identifier       |
| `name`        | Event name                    |
| `description` | Event description             |
| `organizerId` | Organizer that owns the event |
| `status`      | `PUBLIC` or `PRIVATE`         |
| `startAt`     | Event start time              |
| `endAt`       | Event end time                |
| `createdAt`   | Creation timestamp            |
| `updatedAt`   | Last update timestamp         |

An organizer can have multiple events.

When an organizer is deleted, its related events are also deleted through the configured cascade relationship.

---

## Authentication

The API uses **JWT-based authentication**.

Authentication flow:

```text
Register
   │
   ▼
 Login
   │
   ▼
JWT Access Token
   │
   ▼
Bearer Token
   │
   ▼
Protected Endpoint
```

After login, the access token must be included in protected requests:

```http
Authorization: Bearer <access_token>
```

The JWT payload contains:

* `userId`
* `role`

The access token expires after **7 days**.

The JWT secret is configured using the `SECRET_JWT` environment variable.

---

## Authorization

The application implements role-based authorization using NestJS Guards.

### Roles

| Role        | Access                                             |
| ----------- | -------------------------------------------------- |
| `USER`      | Access event information and organizer information |
| `ORGANIZER` | Manage organizer profile and events                |

Examples:

* `ORGANIZER` can create events.
* `ORGANIZER` can update and delete events.
* `USER` can access event information.
* `/organizers/me` requires the `ORGANIZER` role.
* Event ownership is validated when an organizer updates or deletes an event.

Requests with a valid JWT but an unauthorized role return:

```text
403 Forbidden
```

Requests without a valid JWT return:

```text
401 Unauthorized
```

---

## API Endpoints

The application uses `/api` as its global API prefix.

### Authentication

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |

### Organizers

| Method | Endpoint                       | Role      |
| ------ | ------------------------------ | --------- |
| POST   | `/api/organizers`              | ORGANIZER |
| GET    | `/api/organizers/me`           | ORGANIZER |
| PATCH  | `/api/organizers/update`       | ORGANIZER |
| GET    | `/api/organizers/:organizerId` | USER      |

### Events

| Method | Endpoint               | Role      |
| ------ | ---------------------- | --------- |
| POST   | `/api/events`          | ORGANIZER |
| GET    | `/api/events`          | USER      |
| GET    | `/api/events/:eventId` | USER      |
| PATCH  | `/api/events/:eventId` | ORGANIZER |
| DELETE | `/api/events/:eventId` | ORGANIZER |

---

## Request Validation

The application uses NestJS `ValidationPipe` with:

* `whitelist`
* `forbidNonWhitelisted`
* `transform`

DTOs use `class-validator` to validate incoming request data.

Invalid requests return a:

```text
400 Bad Request
```

The validation configuration also prevents unexpected properties from being accepted by the API.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/saputt/event-management.git
cd event-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-postgresql-connection-string"
SECRET_JWT="your-jwt-secret"
PORT=3000
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the application

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000/api
```

---

## Example Authentication Flow

### 1. Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "email": "organizer@example.com",
  "password": "password123",
  "name": "Event Organizer",
  "role": "ORGANIZER"
}
```

### 2. Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "organizer@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "message": "login successfull",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "role": "ORGANIZER",
    "userId": "<USER_ID>"
  }
}
```

### 3. Access Protected Endpoint

Use the returned JWT:

```http
Authorization: Bearer <JWT_TOKEN>
```

For example:

```http
GET /api/organizers/me
```

---

## E2E Testing

The project includes end-to-end tests using **Jest** and **Supertest**.

The E2E tests cover the authentication and authorization flow, including:

### User

* Login returns a JWT access token.
* A user can access a protected endpoint using a valid token.
* A request without a token returns `401 Unauthorized`.
* A user attempting to access an organizer-only endpoint receives `403 Forbidden`.

### Organizer

* Login returns a JWT access token.
* An organizer can access `/organizers/me` using a valid token.
* A request without a token returns `401 Unauthorized`.
* An organizer attempting to access a user-only endpoint receives `403 Forbidden`.

Run the E2E tests:

```bash
npm run test:e2e
```

Run unit tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:cov
```

---

## Project Structure

```text
event-management/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── strategy/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   └── auth.module.ts
│   │
│   ├── organizers/
│   │   ├── dto/
│   │   ├── organizers.controller.ts
│   │   ├── organizers.service.ts
│   │   ├── organizers.repository.ts
│   │   └── organizers.module.ts
│   │
│   ├── events/
│   │   ├── dto/
│   │   ├── events.controller.ts
│   │   ├── events.service.ts
│   │   ├── events.repository.ts
│   │   └── events.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   └── common/
│       ├── decorators/
│       ├── guards/
│       └── helpers/
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## Available Scripts

### Development

```bash
npm run start
npm run start:dev
npm run start:debug
```

### Production

```bash
npm run build
npm run start:prod
```

### Testing

```bash
npm run test
npm run test:watch
npm run test:e2e
npm run test:cov
```

### Code Quality

```bash
npm run lint
npm run format
```

---

## Security

The application implements several basic security mechanisms:

* Password hashing using bcrypt
* JWT-based authentication
* JWT expiration
* JWT authentication guards
* Role-based authorization
* Organizer ownership validation
* Request validation
* Whitelisting of accepted request properties
* Rejection of non-whitelisted request properties

---

## Assignment Requirements

| Requirement                        | Implementation                |
| ---------------------------------- | ----------------------------- |
| NestJS + TypeScript REST API       | NestJS REST API               |
| At least 2 related CRUD operations | Organizer and Event resources |
| SQL database                       | PostgreSQL                    |
| JWT authentication                 | Passport JWT                  |
| E2E testing for token API          | Jest + Supertest              |
| Common project pattern             | Layered Architecture          |
| Pattern explanation                | Architecture section          |

---

## Future Improvements

Possible improvements for the project include:

* Refresh token mechanism
* Pagination and filtering
* Event categories
* Event registration
* Swagger / OpenAPI documentation
* Additional unit and E2E test coverage
* Docker support

---

## Author

**Sauki Putra Raffita**

GitHub:
[https://github.com/saputt](https://github.com/saputt)

Repository:
[https://github.com/saputt/event-management](https://github.com/saputt/event-management)

````