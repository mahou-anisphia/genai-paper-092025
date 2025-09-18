import React, { useState } from "react";

const CustomerForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit customer to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add/Edit Customer</h2>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;