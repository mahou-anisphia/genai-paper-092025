import React, { useState } from "react";
import { api } from "../utils/api";
import { Customer } from "../modules/customer";
import { Button } from "shadcn/ui/button";

export const CustomerForm: React.FC = () => {
  const [form, setForm] = useState<Partial<Customer>>({
    name: "",
    address: "",
    phone: "",
    bankAccount: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      name: "",
      address: "",
      phone: "",
      bankAccount: "",
      role: "user",
    });
    window.location.reload(); // simple refresh to show new entry
  };

  return (
    <form className="grid grid-cols-1 gap-4 max-w-md" onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="border rounded p-2"
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        required
        className="border rounded p-2"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        className="border rounded p-2"
      />
      <input
        name="bankAccount"
        value={form.bankAccount}
        onChange={handleChange}
        placeholder="Bank Account"
        required
        className="border rounded p-2"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border rounded p-2"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <Button type="submit">Save Customer</Button>
    </form>
  );
};