export interface Customer {
  uid: string;
  id: string;
  name: string;
  address: string;
  phone: string;
  bankAccount: string;
  orders?: string[];
  role: "CUSTOMER" | "ADMIN";
}

export class CustomerDomain {
  static validateCustomer(customer: Partial<Customer>): string[] {
    const errors: string[] = [];

    if (!customer.name?.trim()) {
      errors.push("Name is required");
    }

    if (!customer.address?.trim()) {
      errors.push("Address is required");
    }

    if (!customer.phone?.trim()) {
      errors.push("Phone is required");
    } else if (!/^\+?[\d\s-()]+$/.test(customer.phone)) {
      errors.push("Invalid phone format");
    }

    if (!customer.bankAccount?.trim()) {
      errors.push("Bank account is required");
    }

    return errors;
  }

  static createCustomer(data: Omit<Customer, "uid" | "id">): Customer {
    return {
      uid: crypto.randomUUID(),
      id: `CUST-${Date.now()}`,
      orders: [],
      ...data,
    };
  }
}

export type CreateCustomerRequest = Omit<Customer, "uid" | "id" | "orders">;
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;