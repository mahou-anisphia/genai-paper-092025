export interface Invoice {
  id: number;
  orderId: number;
  amount: number;
  date: string; // ISO string
  status: "draft" | "sent" | "paid" | "overdue";
}