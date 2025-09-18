export interface Customer {
  uid: string; // unique system identifier
  id: number; // database primary key
  name: string;
  address: string;
  phone: string;
  bankAccount: string;
  role: "admin" | "user";
  orders?: Order[]; // optional eager load
}