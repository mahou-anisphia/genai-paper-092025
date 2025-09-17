export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerBankAccount: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderDate: Date;
  uid: string;
  invoice?: string;
}

export class OrderDomain {
  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  static validateOrder(order: Partial<Order>): string[] {
    const errors: string[] = [];

    if (!order.customerId) {
      errors.push("Customer ID is required");
    }

    if (!order.items || order.items.length === 0) {
      errors.push("Order must contain at least one item");
    }

    return errors;
  }

  static createOrder(
    customerId: string,
    customerData: any,
    items: OrderItem[]
  ): Order {
    const totalAmount = this.calculateTotal(items);

    return {
      id: `ORD-${Date.now()}`,
      uid: crypto.randomUUID(),
      customerId,
      customerName: customerData.name,
      customerAddress: customerData.address,
      customerPhone: customerData.phone,
      customerBankAccount: customerData.bankAccount,
      items,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      orderDate: new Date(),
    };
  }
}

export type CreateOrderRequest = {
  customerId: string;
  items: Omit<OrderItem, "total">[];
};

export type UpdateOrderRequest = Partial<{
  status: Order["status"];
  paymentStatus: Order["paymentStatus"];
}>;