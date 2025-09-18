export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerBankAccount: string;
  items: string[]; // Array of product IDs
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderDate: Date;
  uid: string;
  invoice?: Invoice;
}