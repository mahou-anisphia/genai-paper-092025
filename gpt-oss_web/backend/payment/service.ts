import { Payment } from "../../modules/payment";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

export class PaymentService {
  async getAll(): Promise<Payment[]> {
    return prisma.payment.findMany();
  }

  async getById(id: number): Promise<Payment | null> {
    return prisma.payment.findUnique({ where: { id } });
  }

  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return prisma.payment.create({ data });
  }

  async update(id: number, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Payment> {
    return prisma.payment.delete({ where: { id } });
  }
}