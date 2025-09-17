

### modules/customer/Customer.ts

```typescript
export interface Customer {
  uid: string;
  id: string;
  name: string;
  address: string;
  phone: string;
  bankAccount: string;
  orders?: string[];
  role: "CUSTOMER" | "ADMIN";
}

export class CustomerDomain {
  static validateCustomer(customer: Partial<Customer>): string[] {
    const errors: string[] = [];

    if (!customer.name?.trim()) {
      errors.push("Name is required");
    }

    if (!customer.address?.trim()) {
      errors.push("Address is required");
    }

    if (!customer.phone?.trim()) {
      errors.push("Phone is required");
    } else if (!/^\+?[\d\s-()]+$/.test(customer.phone)) {
      errors.push("Invalid phone format");
    }

    if (!customer.bankAccount?.trim()) {
      errors.push("Bank account is required");
    }

    return errors;
  }

  static createCustomer(data: Omit<Customer, "uid" | "id">): Customer {
    return {
      uid: crypto.randomUUID(),
      id: `CUST-${Date.now()}`,
      orders: [],
      ...data,
    };
  }
}

export type CreateCustomerRequest = Omit<Customer, "uid" | "id" | "orders">;
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;
```

### modules/order/Order.ts

```typescript
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerBankAccount: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderDate: Date;
  uid: string;
  invoice?: string;
}

export class OrderDomain {
  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  static validateOrder(order: Partial<Order>): string[] {
    const errors: string[] = [];

    if (!order.customerId) {
      errors.push("Customer ID is required");
    }

    if (!order.items || order.items.length === 0) {
      errors.push("Order must contain at least one item");
    }

    return errors;
  }

  static createOrder(
    customerId: string,
    customerData: any,
    items: OrderItem[]
  ): Order {
    const totalAmount = this.calculateTotal(items);

    return {
      id: `ORD-${Date.now()}`,
      uid: crypto.randomUUID(),
      customerId,
      customerName: customerData.name,
      customerAddress: customerData.address,
      customerPhone: customerData.phone,
      customerBankAccount: customerData.bankAccount,
      items,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      orderDate: new Date(),
    };
  }
}

export type CreateOrderRequest = {
  customerId: string;
  items: Omit<OrderItem, "total">[];
};

export type UpdateOrderRequest = Partial<{
  status: Order["status"];
  paymentStatus: Order["paymentStatus"];
}>;
```

### modules/product/Product.ts

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export class ProductDomain {
  static validateProduct(product: Partial<Product>): string[] {
    const errors: string[] = [];

    if (!product.name?.trim()) {
      errors.push("Product name is required");
    }

    if (!product.description?.trim()) {
      errors.push("Product description is required");
    }

    if (!product.price || product.price <= 0) {
      errors.push("Product price must be greater than 0");
    }

    return errors;
  }

  static createProduct(data: Omit<Product, "id">): Product {
    return {
      id: `PROD-${Date.now()}`,
      ...data,
    };
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }
}

export type CreateProductRequest = Omit<Product, "id">;
export type UpdateProductRequest = Partial<CreateProductRequest>;
```

### modules/payment/Payment.ts

```typescript
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  date: Date;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "PAYPAL";
}

export class PaymentDomain {
  static validatePayment(payment: Partial<Payment>): string[] {
    const errors: string[] = [];

    if (!payment.orderId) {
      errors.push("Order ID is required");
    }

    if (!payment.amount || payment.amount <= 0) {
      errors.push("Payment amount must be greater than 0");
    }

    if (!payment.method) {
      errors.push("Payment method is required");
    }

    return errors;
  }

  static createPayment(
    orderId: string,
    amount: number,
    method: Payment["method"]
  ): Payment {
    return {
      id: `PAY-${Date.now()}`,
      orderId,
      amount,
      method,
      status: "PENDING",
      date: new Date(),
    };
  }
}

export type CreatePaymentRequest = Omit<Payment, "id" | "date" | "status">;
export type UpdatePaymentRequest = Partial<Pick<Payment, "status">>;
```

### modules/invoice/Invoice.ts

```typescript
export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  date: Date;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
}

export class InvoiceDomain {
  static validateInvoice(invoice: Partial<Invoice>): string[] {
    const errors: string[] = [];

    if (!invoice.orderId) {
      errors.push("Order ID is required");
    }

    if (!invoice.amount || invoice.amount <= 0) {
      errors.push("Invoice amount must be greater than 0");
    }

    return errors;
  }

  static createInvoice(orderId: string, amount: number): Invoice {
    return {
      id: `INV-${Date.now()}`,
      orderId,
      amount,
      status: "DRAFT",
      date: new Date(),
    };
  }

  static formatInvoiceNumber(id: string): string {
    return id.replace("INV-", "INV-");
  }
}

export type CreateInvoiceRequest = Omit<Invoice, "id" | "date" | "status">;
export type UpdateInvoiceRequest = Partial<Pick<Invoice, "status">>;
```

## Backend Implementation

### backend/shared/database.ts

```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
```

### backend/shared/middleware.ts

```typescript
import { Request, Response, NextFunction } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error("Error:", error);

  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
};

export const validateRequest = (validationFn: (data: any) => string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const errors = validationFn(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    next();
  };
};
```

### backend/customer/CustomerService.ts

```typescript
import {
  Customer,
  CustomerDomain,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../../modules/customer/Customer";
import { prisma } from "../shared/database";

export class CustomerService {
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const customer = CustomerDomain.createCustomer(data);

    const created = await prisma.customer.create({
      data: {
        uid: customer.uid,
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        bankAccount: customer.bankAccount,
        role: customer.role,
      },
    });

    return {
      ...created,
      orders: [],
    };
  }

  async getAllCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    return customers.map((customer) => ({
      ...customer,
      orders: customer.orders.map((order) => order.id),
    }));
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!customer) return null;

    return {
      ...customer,
      orders: customer.orders.map((order) => order.id),
    };
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerRequest
  ): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) return null;

    const updated = await prisma.customer.update({
      where: { id },
      data,
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      ...updated,
      orders: updated.orders.map((order) => order.id),
    };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      await prisma.customer.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

### backend/customer/CustomerController.ts

```typescript
import { Request, Response } from "express";
import { CustomerService } from "./CustomerService";
import { ApiResponse } from "../shared/middleware";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  createCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      res.status(201).json({
        success: true,
        data: customer,
        message: "Customer created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllCustomers = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const customers = await this.customerService.getAllCustomers();
      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getCustomerById = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  updateCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.updateCustomer(id, req.body);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        data: customer,
        message: "Customer updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  deleteCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const deleted = await this.customerService.deleteCustomer(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
```

### backend/customer/CustomerRouter.ts

```typescript
import { Router } from "express";
import { CustomerController } from "./CustomerController";
import { validateRequest } from "../shared/middleware";
import { CustomerDomain } from "../../modules/customer/Customer";

const router = Router();
const customerController = new CustomerController();

router.post(
  "/",
  validateRequest(CustomerDomain.validateCustomer),
  customerController.createCustomer
);

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

router.put(
  "/:id",
  validateRequest(CustomerDomain.validateCustomer),
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

export default router;
```

### backend/product/ProductService.ts

```typescript
import {
  Product,
  ProductDomain,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../modules/product/Product";
import { prisma } from "../shared/database";

export class ProductService {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const product = ProductDomain.createProduct(data);

    const created = await prisma.product.create({
      data: product,
    });

    return created;
  }

  async getAllProducts(): Promise<Product[]> {
    return await prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

### backend/product/ProductController.ts

```typescript
import { Request, Response } from "express";
import { ProductService } from "./ProductService";
import { ApiResponse } from "../shared/middleware";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: "Product created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllProducts = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getProductById = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  updateProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
        message: "Product updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  deleteProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
```

### backend/product/ProductRouter.ts

```typescript
import { Router } from "express";
import { ProductController } from "./ProductController";
import { validateRequest } from "../shared/middleware";
import { ProductDomain } from "../../modules/product/Product";

const router = Router();
const productController = new ProductController();

router.post(
  "/",
  validateRequest(ProductDomain.validateProduct),
  productController.createProduct
);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  validateRequest(ProductDomain.validateProduct),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

export default router;
```

### backend/server.ts

```typescript
import express from "express";
import cors from "cors";
import { connectDatabase, disconnectDatabase } from "./shared/database";
import { errorHandler } from "./shared/middleware";

import customerRouter from "./customer/CustomerRouter";
import productRouter from "./product/ProductRouter";
// Import other routers similarly

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
// Add other routes

app.use(errorHandler);

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

startServer().catch(console.error);
```

## Frontend Implementation

### frontend/shared/api.ts

```typescript
import { ApiResponse } from "../../backend/shared/middleware";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data,
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
```

### frontend/shared/components/ui/button.tsx

```typescript
import React from "react";
import { cn } from "../utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50":
              variant === "outline",
            "bg-gray-100 text-gray-900 hover:bg-gray-200":
              variant === "secondary",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

### frontend/shared/components/ui/input.tsx

```typescript
import React from "react";
import { cn } from "../utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
```

### frontend/shared/components/ui/table.tsx

```typescript
import React from "react";
import { cn } from "../utils";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";
```

### frontend/shared/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### frontend/customer/CustomerBrowser.tsx

```typescript
import React, { useState, useEffect } from "react";
import { Customer } from "../../modules/customer/Customer";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/components/ui/table";

interface CustomerBrowserProps {
  onSelectCustomer?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customerId: string) => void;
}

export const CustomerBrowser: React.FC<CustomerBrowserProps> = ({
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Customer[]>("/customers");
      if (response.success && response.data) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await apiClient.delete(`/customers/${customerId}`);
      setCustomers(customers.filter((c) => c.id !== customerId));
      onDeleteCustomer?.(customerId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete customer"
      );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading customers...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
        <Button onClick={loadCustomers} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={loadCustomers}>Refresh</Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No customers found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.uid}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.role}</TableCell>
                <TableCell>{customer.orders?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onSelectCustomer && (
                      <Button
                        size="sm"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        Select
                      </Button>
                    )}
                    {onEditCustomer && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditCustomer(customer)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
```

### frontend/customer/CustomerForm.tsx

```typescript
import React, { useState, useEffect } from "react";
import {
  Customer,
  CreateCustomerRequest,
  CustomerDomain,
} from "../../modules/customer/Customer";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import { Input } from "../shared/components/ui/input";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit?: (customer: Customer) => void;
  onCancel?: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: "",
    address: "",
    phone: "",
    bankAccount: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        bankAccount: customer.bankAccount,
        role: customer.role,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = CustomerDomain.validateCustomer(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      let response;
      if (customer) {
        response = await apiClient.put<Customer>(
          `/customers/${customer.id}`,
          formData
        );
      } else {
        response = await apiClient.post<Customer>("/customers", formData);
      }

      if (response.success && response.data) {
        onSubmit?.(response.data);
      }
    } catch (err) {
      setErrors([
        err instanceof Error ? err.message : "Failed to save customer",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof CreateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {customer ? "Edit Customer" : "Create Customer"}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <ul className="text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            placeholder="Enter customer address"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label
            htmlFor="bankAccount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bank Account
          </label>
          <Input
            id="bankAccount"
            type="text"
            value={formData.bankAccount}
            onChange={handleChange("bankAccount")}
            placeholder="Enter bank account"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange("role")}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : customer ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
```

### frontend/customer/index.tsx

```typescript
import React, { useState } from "react";
import { Customer } from "../../modules/customer/Customer";
import { CustomerBrowser } from "./CustomerBrowser";
import { CustomerForm } from "./CustomerForm";
import { Button } from "../shared/components/ui/button";

type ViewMode = "browser" | "form";

export const CustomerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleCreateNew = () => {
    setSelectedCustomer(null);
    setViewMode("form");
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewMode("form");
  };

  const handleFormSubmit = (customer: Customer) => {
    setViewMode("browser");
    setSelectedCustomer(null);
  };

  const handleFormCancel = () => {
    setViewMode("browser");
    setSelectedCustomer(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === "browser" ? (
        <div>
          <div className="mb-6">
            <Button onClick={handleCreateNew}>Create New Customer</Button>
          </div>
          <CustomerBrowser
            onEditCustomer={handleEdit}
            onDeleteCustomer={() => {
              // Browser handles the deletion internally
            }}
          />
        </div>
      ) : (
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
```

### frontend/product/ProductBrowser.tsx

```typescript
import React, { useState, useEffect } from "react";
import { Product, ProductDomain } from "../../modules/product/Product";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/components/ui/table";

interface ProductBrowserProps {
  onSelectProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Product[]>("/products");
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await apiClient.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      onDeleteProduct?.(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
        <Button onClick={loadProducts} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={loadProducts}>Refresh</Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No products found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.description}
                </TableCell>
                <TableCell>
                  {ProductDomain.formatPrice(product.price)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onSelectProduct && (
                      <Button
                        size="sm"
                        onClick={() => onSelectProduct(product)}
                      >
                        Select
                      </Button>
                    )}
                    {onEditProduct && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
```

### frontend/product/ProductForm.tsx

```typescript
import React, { useState, useEffect } from "react";
import {
  Product,
  CreateProductRequest,
  ProductDomain,
} from "../../modules/product/Product";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import { Input } from "../shared/components/ui/input";

interface ProductFormProps {
  product?: Product | null;
  onSubmit?: (product: Product) => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = ProductDomain.validateProduct(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      let response;
      if (product) {
        response = await apiClient.put<Product>(
          `/products/${product.id}`,
          formData
        );
      } else {
        response = await apiClient.post<Product>("/products", formData);
      }

      if (response.success && response.data) {
        onSubmit?.(response.data);
      }
    } catch (err) {
      setErrors([
        err instanceof Error ? err.message : "Failed to save product",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof CreateProductRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "price" ? parseFloat(e.target.value) || 0 : e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Create Product"}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <ul className="text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Enter product description"
            rows={4}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange("price")}
            placeholder="Enter product price"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
```

### frontend/product/index.tsx

```typescript
import React, { useState } from "react";
import { Product } from "../../modules/product/Product";
import { ProductBrowser } from "./ProductBrowser";
import { ProductForm } from "./ProductForm";
import { Button } from "../shared/components/ui/button";

type ViewMode = "browser" | "form";

export const ProductPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setViewMode("form");
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setViewMode("form");
  };

  const handleFormSubmit = (product: Product) => {
    setViewMode("browser");
    setSelectedProduct(null);
  };

  const handleFormCancel = () => {
    setViewMode("browser");
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === "browser" ? (
        <div>
          <div className="mb-6">
            <Button onClick={handleCreateNew}>Create New Product</Button>
          </div>
          <ProductBrowser
            onEditProduct={handleEdit}
            onDeleteProduct={() => {
              // Browser handles the deletion internally
            }}
          />
        </div>
      ) : (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
```

## Configuration Files

### package.json

```json
{
  "name": "ecommerce-app",
  "version": "1.0.0",
  "description": "Full-stack e-commerce application with domain-driven design",
  "main": "index.js",
  "scripts": {
    "dev:frontend": "cd frontend && npm run start",
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "cd backend && npm start",
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm test",
    "test:backend": "cd backend && npm test",
    "db:generate": "cd backend && npx prisma generate",
    "db:migrate": "cd backend && npx prisma migrate dev",
    "db:studio": "cd backend && npx prisma studio"
  },
  "keywords": [
    "ecommerce",
    "react",
    "express",
    "typescript",
    "domain-driven-design"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "workspaces": ["frontend", "backend"]
}
```

### backend/package.json

```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "Backend API for e-commerce application",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only server.ts",
    "build": "tsc",
    "test": "jest",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0",
    "prisma": "^5.0.0"
  }
}
```

### frontend/package.json

```json
{
  "name": "ecommerce-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@tailwindcss/forms": "^0.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### backend/prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Customer {
  uid         String   @id @default(cuid())
  id          String   @unique
  name        String
  address     String
  phone       String
  bankAccount String   @map("bank_account")
  role        Role     @default(CUSTOMER)
  orders      Order[]
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("customers")
}

model Product {
  id          String   @id
  name        String
  description String
  price       Float
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("products")
}

model Order {
  id                    String        @id
  uid                   String        @unique @default(cuid())
  customerId            String        @map("customer_id")
  customerName          String        @map("customer_name")
  customerAddress       String        @map("customer_address")
  customerPhone         String        @map("customer_phone")
  customerBankAccount   String        @map("customer_bank_account")
  items                 Json
  totalAmount           Float         @map("total_amount")
  status                OrderStatus   @default(PENDING)
  paymentStatus         PaymentStatus @default(PENDING)
  orderDate             DateTime      @default(now()) @map("order_date")
  invoiceId             String?       @map("invoice_id")

  customer              Customer      @relation(fields: [customerId], references: [id])
  payments              Payment[]
  invoice               Invoice?

  @@map("orders")
}

model Payment {
  id       String            @id
  orderId  String            @map("order_id")
  amount   Float
  date     DateTime          @default(now())
  status   PaymentStatus     @default(PENDING)
  method   PaymentMethod

  order    Order             @relation(fields: [orderId], references: [id])

  @@map("payments")
}

model Invoice {
  id       String         @id
  orderId  String         @unique @map("order_id")
  amount   Float
  date     DateTime       @default(now())
  status   InvoiceStatus  @default(DRAFT)

  order    Order          @relation(fields: [orderId], references: [id])

  @@map("invoices")
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
  PAYPAL
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}
```

### frontend/tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_USER: ecommerce
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ecommerce_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://ecommerce:password@postgres:5432/ecommerce_db
      PORT: 5000
      NODE_ENV: development
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### backend/.env

```env
DATABASE_URL="postgresql://ecommerce:password@localhost:5432/ecommerce_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### backend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### frontend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "../modules"]
}
```


