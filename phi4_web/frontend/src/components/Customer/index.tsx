import React from "react";
import CustomerForm from "./form";
import CustomerBrowser from "./browser";

const CustomerIndex = () => (
  <div>
    <h1>Customer Management</h1>
    <CustomerBrowser />
    <CustomerForm />
  </div>
);

export default CustomerIndex;