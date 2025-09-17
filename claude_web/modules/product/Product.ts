export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export class ProductDomain {
  static validateProduct(product: Partial<Product>): string[] {
    const errors: string[] = [];

    if (!product.name?.trim()) {
      errors.push("Product name is required");
    }

    if (!product.description?.trim()) {
      errors.push("Product description is required");
    }

    if (!product.price || product.price <= 0) {
      errors.push("Product price must be greater than 0");
    }

    return errors;
  }

  static createProduct(data: Omit<Product, "id">): Product {
    return {
      id: `PROD-${Date.now()}`,
      ...data,
    };
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }
}

export type CreateProductRequest = Omit<Product, "id">;
export type UpdateProductRequest = Partial<CreateProductRequest>;