import {
  Product,
  ProductDomain,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../modules/product/Product";
import { prisma } from "../shared/database";

export class ProductService {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const product = ProductDomain.createProduct(data);

    const created = await prisma.product.create({
      data: product,
    });

    return created;
  }

  async getAllProducts(): Promise<Product[]> {
    return await prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}