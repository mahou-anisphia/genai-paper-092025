import { Order, OrderItem } from "../../modules/order";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

export class OrderService {
  async getAll(): Promise<Order[]> {
    return prisma.order.findMany({
      include: { payments: true, invoice: true },
    });
  }

  async getById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { payments: true, invoice: true },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({ data });
  }

  async update(id: number, data: Prisma.OrderUpdateInput): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Order> {
    return prisma.order.delete({ where: { id } });
  }

  // Helper to calculate totalAmount
  async calculateTotal(items: OrderItem[]): Promise<number> {
    return items.reduce((sum, it) => sum + it.totalPrice, 0);
  }
}