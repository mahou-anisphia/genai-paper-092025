import React, { useState } from "react";
import { Customer } from "../../modules/customer/Customer";
import { CustomerBrowser } from "./CustomerBrowser";
import { CustomerForm } from "./CustomerForm";
import { Button } from "../shared/components/ui/button";

type ViewMode = "browser" | "form";

export const CustomerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleCreateNew = () => {
    setSelectedCustomer(null);
    setViewMode("form");
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewMode("form");
  };

  const handleFormSubmit = (customer: Customer) => {
    setViewMode("browser");
    setSelectedCustomer(null);
  };

  const handleFormCancel = () => {
    setViewMode("browser");
    setSelectedCustomer(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === "browser" ? (
        <div>
          <div className="mb-6">
            <Button onClick={handleCreateNew}>Create New Customer</Button>
          </div>
          <CustomerBrowser
            onEditCustomer={handleEdit}
            onDeleteCustomer={() => {
              // Browser handles the deletion internally
            }}
          />
        </div>
      ) : (
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};