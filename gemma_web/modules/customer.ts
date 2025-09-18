export interface Customer {
  uid: string;
  id: number;
  name: string;
  address: string;
  phone: string;
  bankAccount: string;
  orders: number[]; // Array of order IDs
  role: string;
}