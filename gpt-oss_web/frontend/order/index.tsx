import React from "react";
import { OrderBrowser } from "./browser";
import { OrderForm } from "./form";

export const OrderIndex: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Orders</h1>
    <OrderBrowser />
    <hr className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Add / Edit Order</h2>
    <OrderForm />
  </div>
);