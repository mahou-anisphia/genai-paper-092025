import { Product } from "../../modules/product";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

export class ProductService {
  async getAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async getById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }
}