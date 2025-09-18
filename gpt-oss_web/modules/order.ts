import { Product } from "./product";
import { Payment } from "./payment";
import { Invoice } from "./invoice";

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerBankAccount: string;
  items: OrderItem[];
  totalAmount: number;
  status: "draft" | "submitted" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "partial" | "paid";
  orderDate: string; // ISO string
  uid: string;
  invoice?: Invoice;
  payments?: Payment[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}