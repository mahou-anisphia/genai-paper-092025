

```bash
project/
backend/
modules/
customer/
customer.service.ts
customer.controller.ts
customer.router.ts
...
express.ts
app.ts
package.json
tsconfig.json
...
frontend/
components/
Customer/
index.tsx
browser.tsx
form.tsx
...
...
modules/
customer.ts
order.ts
product.ts
payment.ts
invoice.ts
...
README.md
```

**Domain Models**

### Customer

```typescript
// modules/customer.ts
export interface Customer {
  uid: string;
  id: number;
  name: string;
  address: string;
  phone: string;
  bankAccount: string;
  orders: Order[];
  role: string;
}
```

### Order

```typescript
// modules/order.ts
export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerBankAccount: string;
  items: Product[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderDate: Date;
  uid: string;
  invoice: Invoice;
}
```

### Product

```typescript
// modules/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}
```

### Payment

```typescript
// modules/payment.ts
export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  date: Date;
  status: string;
  method: string;
}
```

### Invoice

```typescript
// modules/invoice.ts
export interface Invoice {
  id: number;
  orderId: number;
  amount: number;
  date: Date;
  status: string;
}
```

**Backend**

### Customer Service

```typescript
// backend/modules/customer/customer.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCustomers() {
  return await prisma.customer.findMany();
}

export async function getCustomer(id: number) {
  return await prisma.customer.findUnique({
    where: { id },
  });
}

export async function createCustomer(data: any) {
  return await prisma.customer.create({
    data,
  });
}

export async function updateCustomer(id: number, data: any) {
  return await prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: number) {
  return await prisma.customer.delete({
    where: { id },
  });
}
```

### Customer Controller

```typescript
// backend/modules/customer/customer.controller.ts
import express, { Request, Response } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customer.service";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const customers = await getCustomers();
  res.json(customers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const customer = await getCustomer(id);
  res.json(customer);
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const customer = await createCustomer(data);
  res.json(customer);
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const customer = await updateCustomer(id, data);
  res.json(customer);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted successfully" });
});

export default router;
```

### Customer Router

```typescript
// backend/modules/customer/customer.router.ts
import express from "express";
import customerController from "./customer.controller";

const router = express.Router();

router.use("/customers", customerController);

export default router;
```

**Frontend**

### Customer Index

```typescript
// frontend/components/Customer/index.tsx
import React from "react";

const CustomerIndex = () => {
  return (
    <div>
      <h1>Customer Index</h1>
    </div>
  );
};

export default CustomerIndex;
```

### Customer Browser

```typescript
// frontend/components/Customer/browser.tsx
import React, { useState, useEffect } from "react";

const CustomerBrowser = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data));
  }, []);

  return (
    <div>
      <h1>Customer Browser</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerBrowser;
```

### Customer Form

```typescript
// frontend/components/Customer/form.tsx
import React, { useState } from "react";

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, phone }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <br />
      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <br />
      <label>
        Phone:
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;


==============================================
End Time: 2025-09-15 01:24:04
Duration: 637 seconds
Status: SUCCESS
==============================================
