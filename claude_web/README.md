# E-Commerce Application

A full-stack e-commerce application built with React, Express, and PostgreSQL following Domain-Driven Design principles.

### Architecture Overview

This application follows a modular, domain-driven design approach with clear separation of concerns:

### Project Structure
```

ecommerce-app/
├── frontend/ # React frontend application
│ ├── customer/ # Customer-related components
│ ├── order/ # Order management components  
│ ├── product/ # Product catalog components
│ ├── payment/ # Payment processing components
│ ├── invoice/ # Invoice management components
│ └── shared/ # Shared UI components and utilities
├── backend/ # Express.js backend API
│ ├── customer/ # Customer service, controller, router
│ ├── order/ # Order service, controller, router
│ ├── product/ # Product service, controller, router
│ ├── payment/ # Payment service, controller, router
│ ├── invoice/ # Invoice service, controller, router
│ └── shared/ # Database connection, middleware
├── modules/ # Shared domain models
│ ├── customer/ # Customer domain logic and types
│ ├── order/ # Order domain logic and types
│ ├── product/ # Product domain logic and types
│ ├── payment/ # Payment domain logic and types
│ └── invoice/ # Invoice domain logic and types
└── README.md

````

### Domain Models

Each domain entity has:
- **Interface**: TypeScript type definitions
- **Domain Class**: Business logic and validation
- **Helper Methods**: Utility functions for data manipulation

### Backend Architecture

Each API endpoint follows a 3-layer pattern:
- **Router**: Express routes and request validation
- **Controller**: Request/response handling and error management
- **Service**: Core business logic and database operations

### Frontend Architecture

Each page consists of:
- **Index**: Main page component with navigation
- **Browser**: Data listing and management interface
- **Form**: Create/edit forms with validation

# Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN Components** - Pre-built UI components

### Backend
- **Express.js** - Web application framework
- **TypeScript 5** - Type safety
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database

### Development Tools
- **Docker** - Containerization
- **Concurrently** - Run multiple npm scripts
- **ts-node-dev** - TypeScript development server

# Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn package manager

# Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-app
````

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Environment Configuration

Create environment files:

**backend/.env:**

```env
DATABASE_URL="postgresql://ecommerce:password@localhost:5432/ecommerce_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

**frontend/.env:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up postgres -d

# Generate Prisma client
cd backend && npm run db:generate

# Run database migrations
npm run db:migrate
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database `ecommerce_db`
3. Update `DATABASE_URL` in backend/.env
4. Run migrations:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

# Running the Application

### Development Mode

#### Option A: Using npm scripts (Recommended)

```bash
# Start both frontend and backend
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Option B: Manual startup

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

#### Option C: Using Docker Compose

```bash
# Start all services
docker-compose up
```

### Production Mode

```bash
# Build applications
npm run build

# Start production server
npm start
```

# API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Customers

- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

#### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Orders

- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status
- `DELETE /orders/:id` - Cancel order

#### Payments

- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Process payment
- `PUT /payments/:id` - Update payment status

#### Invoices

- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create invoice
- `PUT /invoices/:id` - Update invoice status

### Request/Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

### Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

# Database Schema

### Tables

#### customers

- `uid` (String, Primary Key)
- `id` (String, Unique)
- `name` (String)
- `address` (String)
- `phone` (String)
- `bank_account` (String)
- `role` (Enum: CUSTOMER, ADMIN)

#### products

- `id` (String, Primary Key)
- `name` (String)
- `description` (String)
- `price` (Float)

#### orders

- `id` (String, Primary Key)
- `uid` (String, Unique)
- `customer_id` (String, Foreign Key)
- `customer_name` (String)
- `customer_address` (String)
- `customer_phone` (String)
- `customer_bank_account` (String)
- `items` (JSON)
- `total_amount` (Float)
- `status` (Enum)
- `payment_status` (Enum)
- `order_date` (DateTime)

#### payments

- `id` (String, Primary Key)
- `order_id` (String, Foreign Key)
- `amount` (Float)
- `date` (DateTime)
- `status` (Enum)
- `method` (Enum)

#### invoices

- `id` (String, Primary Key)
- `order_id` (String, Foreign Key)
- `amount` (Float)
- `date` (DateTime)
- `status` (Enum)

# Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```
# Database Management

```bash
# View database in Prisma Studio
cd backend && npm run db:studio

# Reset database
cd backend && npx prisma migrate reset

# Generate new migration
cd backend && npx prisma migrate dev --name migration-name

# Seed database
cd backend && npm run db:seed
```

# Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build applications:

```bash
npm run build
```

2. Set production environment variables
3. Deploy to your hosting platform
4. Run database migrations in production

# Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

# License

This project is licensed under the MIT License - see the LICENSE file for details.

```

This comprehensive implementation provides a full-stack web application following all the specified requirements. The project uses Domain-Driven Design with shared modules, implements RESTful APIs, and includes a complete React frontend with Tailwind CSS and ShadCN components. The backend uses Express with Prisma ORM and PostgreSQL, and everything is built with TypeScript 5.

The architecture ensures clean separation of concerns, reusable domain logic, and maintainable code structure. The README provides detailed setup instructions and API documentation for easy deployment and usage.
```
