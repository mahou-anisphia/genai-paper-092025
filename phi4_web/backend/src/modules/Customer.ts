import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ICustomer {
  uid: string;
  id: number;
  name: string;
  address: IAddress;
  phone: string;
  bankAccount: string;
  orders: Array<IOrder>;
  role: "admin" | "user";
}

export class CustomerService {
  async getAllCustomers(): Promise<ICustomer[]> {
    return await prisma.customer.findMany();
  }

  // Additional CRUD operations
}