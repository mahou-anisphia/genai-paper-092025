# Full-Stack Application

This is a full-stack web application built with React, Express, Prisma, and TypeScript. It follows a Domain-Driven Design approach with a RESTful API.

## Architecture

- **Frontend:** React, Tailwind CSS, Shadcn UI
- **Backend:** Express, Prisma ORM, PostgreSQL
- **Domain Model:** Defined in TypeScript modules, shared between frontend and backend.

## Setup

1.  **Clone the repository:** `git clone <repository_url>`
2.  **Install dependencies:**
    - `cd fullstack-app`
    - `npm install`
    - `cd frontend && npm install`
    - `cd ../backend && npm install`
3.  **Configure Prisma:**
    - Create a `.env` file in the `backend` directory with your database connection string (e.g., `DATABASE_URL=postgresql://user:password@host:port/database`).
    - Run `npx prisma migrate dev` to create the database schema.
4.  **Start the application:**
    - `npm run start` (in the root directory). This will start both the frontend and backend servers.

## API Documentation

The application exposes the following RESTful APIs:

- **/customers:** CRUD operations for customers.
- **/invoices:** CRUD operations for invoices.
- **/orders:** CRUD operations for orders.
- **/payments:** CRUD operations for payments.
- **/products:** CRUD operations for products.