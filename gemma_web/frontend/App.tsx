import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerPage from "./customer/index";
import InvoicePage from "./invoice/index";
import OrderPage from "./order/index";
import PaymentPage from "./payment/index";
import ProductPage from "./product/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/products" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;