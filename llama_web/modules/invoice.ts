export interface Invoice {
  id: number;
  orderId: number;
  amount: number;
  date: Date;
  status: string;
}