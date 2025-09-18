export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  date: string; // ISO string
  status: "pending" | "completed" | "failed";
  method: "credit_card" | "bank_transfer" | "paypal";
}