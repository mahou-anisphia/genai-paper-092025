import React from "react";
import CustomerBrowser from "./browser";
import CustomerForm from "./form";

function CustomerPage() {
  return (
    <div>
      <h1>Customers</h1>
      <CustomerBrowser />
      <CustomerForm />
    </div>
  );
}

export default CustomerPage;