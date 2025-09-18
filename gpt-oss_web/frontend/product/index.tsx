import React from "react";
import { ProductBrowser } from "./browser";
import { ProductForm } from "./form";

export const ProductIndex: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Products</h1>
    <ProductBrowser />
    <hr className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Add / Edit Product</h2>
    <ProductForm />
  </div>
);