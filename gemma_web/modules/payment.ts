export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  date: Date;
  status: string;
  method: string;
}