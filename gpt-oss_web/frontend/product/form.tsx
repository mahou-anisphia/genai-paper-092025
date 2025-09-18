import React, { useState } from "react";
import { api } from "../utils/api";
import { Product } from "../modules/product";
import { Button } from "shadcn/ui/button";

export const ProductForm: React.FC = () => {
  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    price: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    await api("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm({ name: "", price: "", description: "" });
    window.location.reload();
  };

  return (
    <form className="grid grid-cols-1 gap-4 max-w-md" onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
        className="border rounded p-2"
      />
      <input
        name="price"
        type="number"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border rounded p-2"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="border rounded p-2"
      />
      <Button type="submit">Save Product</Button>
    </form>
  );
};