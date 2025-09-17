import React, { useState, useEffect } from "react";
import { Customer } from "../../modules/customer/Customer";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/components/ui/table";

interface CustomerBrowserProps {
  onSelectCustomer?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customerId: string) => void;
}

export const CustomerBrowser: React.FC<CustomerBrowserProps> = ({
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Customer[]>("/customers");
      if (response.success && response.data) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await apiClient.delete(`/customers/${customerId}`);
      setCustomers(customers.filter((c) => c.id !== customerId));
      onDeleteCustomer?.(customerId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete customer"
      );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading customers...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
        <Button onClick={loadCustomers} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={loadCustomers}>Refresh</Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No customers found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.uid}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.role}</TableCell>
                <TableCell>{customer.orders?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onSelectCustomer && (
                      <Button
                        size="sm"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        Select
                      </Button>
                    )}
                    {onEditCustomer && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditCustomer(customer)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};