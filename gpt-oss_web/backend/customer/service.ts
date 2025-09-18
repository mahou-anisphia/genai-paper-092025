import { Customer } from "../../modules/customer";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

export class CustomerService {
  async getAll(): Promise<Customer[]> {
    return prisma.customer.findMany();
  }

  async getById(id: number): Promise<Customer | null> {
    return prisma.customer.findUnique({ where: { id } });
  }

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return prisma.customer.create({ data });
  }

  async update(
    id: number,
    data: Prisma.CustomerUpdateInput
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Customer> {
    return prisma.customer.delete({ where: { id } });
  }
}