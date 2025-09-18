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