import React from "react";
import { CustomerIndex } from "./customer";
import { ProductIndex } from "./product";
import { OrderIndex } from "./order";
import { PaymentIndex } from "./payment";
import { InvoiceIndex } from "./invoice";

const routes: Record<string, React.FC> = {
  "/customers": CustomerIndex,
  "/products": ProductIndex,
  "/orders": OrderIndex,
  "/payments": PaymentIndex,
  "/invoices": InvoiceIndex,
};

export const App: React.FC = () => {
  const path = window.location.pathname;
  const Page = routes[path] ?? (() => <p>Not found</p>);
  return <Page />;
};