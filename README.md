# Event Management API

A simple REST API for managing organizers and events, built with NestJS and TypeScript.

The application provides JWT authentication, role-based authorization, PostgreSQL database integration with Prisma ORM, request validation, and end-to-end testing.

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Organizer management
- Event management
- Organizer–Event relationship
- Request validation
- Protected API endpoints
- E2E authentication and authorization testing

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Programming language |
| PostgreSQL | Relational database |
| Prisma | ORM and database access |
| Passport JWT | Authentication |
| bcrypt | Password hashing |
| Jest | Testing |
| Supertest | HTTP E2E testing |
| Bruno | API documentation |

## Architecture

This project uses **Layered Architecture**.

### Layer Responsibilities

* **Controller** — handles HTTP requests, responses, parameters, and request bodies.
* **Service** — contains application and business logic.
* **Repository** — handles database operations.
* **Prisma** — provides the ORM layer for PostgreSQL.

### Why Layered Architecture?

Layered Architecture is used to separate responsibilities between HTTP handling, business logic, and database access. This makes the project easier to understand, maintain, and extend.

## Database

The application uses **PostgreSQL** with **Prisma ORM**.

* A user can have at most one organizer.
* An organizer can have multiple events.
* Each event belongs to an organizer.
* Related events are deleted when their organizer is deleted through the configured cascade relationship.

## Authentication & Authorization

The API uses JWT-based authentication.

Protected requests use:

```http
Authorization: Bearer <access_token>
```

The JWT contains the user ID and role, and the token expires after 7 days.

The application has two roles:

| Role      | Access                                 |
| --------- | -------------------------------------- |
| USER      | Access event and organizer information |
| ORGANIZER | Manage organizer profile and events    |

Unauthorized requests return `401 Unauthorized`, while requests with an authenticated but unauthorized role return `403 Forbidden`.

## API Endpoints

The global API prefix is `/api`.

### Authentication

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |

### Organizers

| Method | Endpoint                       | Access    |
| ------ | ------------------------------ | --------- |
| POST   | `/api/organizers`              | ORGANIZER |
| GET    | `/api/organizers/me`           | ORGANIZER |
| PATCH  | `/api/organizers/update`       | ORGANIZER |
| GET    | `/api/organizers/:organizerId` | USER      |

### Events

| Method | Endpoint               | Access    |
| ------ | ---------------------- | --------- |
| POST   | `/api/events`          | ORGANIZER |
| GET    | `/api/events`          | USER      |
| GET    | `/api/events/:eventId` | USER      |
| PATCH  | `/api/events/:eventId` | ORGANIZER |
| DELETE | `/api/events/:eventId` | ORGANIZER |

## API Documentation

The API is documented using **Bruno**.

The Bruno collection is available in:

```text
docs/api-docs/
```

Open/import the collection with Bruno to test the API endpoints.

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

Create a `.env` file:

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

## E2E Testing

The project includes E2E tests using Jest and Supertest.

The tests cover:

* Login and JWT token generation
* Access using a valid JWT
* Access without a token
* Role-based authorization
* Organizer authorization

Run E2E tests with:

```bash
npm run test:e2e
```

## Project Structure

```text
event-management/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   ├── organizers/
│   ├── events/
│   ├── prisma/
│   └── common/
├── test/
│   └── app.e2e-spec.ts
├── docs/
│   └── api-docs/
├── package.json
└── README.md
```

## Author

**Sauki Putra Raffita**

GitHub: https://github.com/saputt

Repository: https://github.com/saputt/event-management
