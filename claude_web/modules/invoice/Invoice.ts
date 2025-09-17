export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  date: Date;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
}

export class InvoiceDomain {
  static validateInvoice(invoice: Partial<Invoice>): string[] {
    const errors: string[] = [];

    if (!invoice.orderId) {
      errors.push("Order ID is required");
    }

    if (!invoice.amount || invoice.amount <= 0) {
      errors.push("Invoice amount must be greater than 0");
    }

    return errors;
  }

  static createInvoice(orderId: string, amount: number): Invoice {
    return {
      id: `INV-${Date.now()}`,
      orderId,
      amount,
      status: "DRAFT",
      date: new Date(),
    };
  }

  static formatInvoiceNumber(id: string): string {
    return id.replace("INV-", "INV-");
  }
}

export type CreateInvoiceRequest = Omit<Invoice, "id" | "date" | "status">;
export type UpdateInvoiceRequest = Partial<Pick<Invoice, "status">>;