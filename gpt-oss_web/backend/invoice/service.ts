import { Invoice } from "../../modules/invoice";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

export class InvoiceService {
  async getAll(): Promise<Invoice[]> {
    return prisma.invoice.findMany();
  }

  async getById(id: number): Promise<Invoice | null> {
    return prisma.invoice.findUnique({ where: { id } });
  }

  async create(data: Prisma.InvoiceCreateInput): Promise<Invoice> {
    return prisma.invoice.create({ data });
  }

  async update(id: number, data: Prisma.InvoiceUpdateInput): Promise<Invoice> {
    return prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Invoice> {
    return prisma.invoice.delete({ where: { id } });
  }
}