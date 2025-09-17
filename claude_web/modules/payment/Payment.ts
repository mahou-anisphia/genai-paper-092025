export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  date: Date;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "PAYPAL";
}

export class PaymentDomain {
  static validatePayment(payment: Partial<Payment>): string[] {
    const errors: string[] = [];

    if (!payment.orderId) {
      errors.push("Order ID is required");
    }

    if (!payment.amount || payment.amount <= 0) {
      errors.push("Payment amount must be greater than 0");
    }

    if (!payment.method) {
      errors.push("Payment method is required");
    }

    return errors;
  }

  static createPayment(
    orderId: string,
    amount: number,
    method: Payment["method"]
  ): Payment {
    return {
      id: `PAY-${Date.now()}`,
      orderId,
      amount,
      method,
      status: "PENDING",
      date: new Date(),
    };
  }
}

export type CreatePaymentRequest = Omit<Payment, "id" | "date" | "status">;
export type UpdatePaymentRequest = Partial<Pick<Payment, "status">>;