import React from "react";
import { CustomerBrowser } from "./browser";
import { CustomerForm } from "./form";

export const CustomerIndex: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Customers</h1>
    <CustomerBrowser />
    <hr className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Add / Edit Customer</h2>
    <CustomerForm />
  </div>
);