import React, { useState, useEffect } from "react";
import type {
  Customer,
  CreateCustomerRequest,
  CustomerDomain,
} from "../../../modules/customer/Customer";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import { Input } from "../shared/components/ui/input";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit?: (customer: Customer) => void;
  onCancel?: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: "",
    address: "",
    phone: "",
    bankAccount: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        bankAccount: customer.bankAccount,
        role: customer.role,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = CustomerDomain.validateCustomer(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      let response;
      if (customer) {
        response = await apiClient.put<Customer>(
          `/customers/${customer.id}`,
          formData
        );
      } else {
        response = await apiClient.post<Customer>("/customers", formData);
      }

      if (response.success && response.data) {
        onSubmit?.(response.data);
      }
    } catch (err) {
      setErrors([
        err instanceof Error ? err.message : "Failed to save customer",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof CreateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {customer ? "Edit Customer" : "Create Customer"}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <ul className="text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            placeholder="Enter customer address"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label
            htmlFor="bankAccount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bank Account
          </label>
          <Input
            id="bankAccount"
            type="text"
            value={formData.bankAccount}
            onChange={handleChange("bankAccount")}
            placeholder="Enter bank account"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange("role")}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : customer ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
