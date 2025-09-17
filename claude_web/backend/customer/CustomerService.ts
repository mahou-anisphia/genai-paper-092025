import {
  Customer,
  CustomerDomain,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../../modules/customer/Customer";
import { prisma } from "../shared/database";

export class CustomerService {
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const customer = CustomerDomain.createCustomer(data);

    const created = await prisma.customer.create({
      data: {
        uid: customer.uid,
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        bankAccount: customer.bankAccount,
        role: customer.role,
      },
    });

    return {
      ...created,
      orders: [],
    };
  }

  async getAllCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    return customers.map((customer) => ({
      ...customer,
      orders: customer.orders.map((order) => order.id),
    }));
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!customer) return null;

    return {
      ...customer,
      orders: customer.orders.map((order) => order.id),
    };
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerRequest
  ): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) return null;

    const updated = await prisma.customer.update({
      where: { id },
      data,
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      ...updated,
      orders: updated.orders.map((order) => order.id),
    };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      await prisma.customer.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}