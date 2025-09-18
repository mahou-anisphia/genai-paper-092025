import React, { useEffect, useState } from "react";

const CustomerBrowser = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch customers from backend
  }, []);

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerBrowser;