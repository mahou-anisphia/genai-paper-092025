import React, { useState, useEffect } from "react";
import type {
  Product,
  CreateProductRequest,
  ProductDomain,
} from "../../../modules/product/Product";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import { Input } from "../shared/components/ui/input";

interface ProductFormProps {
  product?: Product | null;
  onSubmit?: (product: Product) => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = ProductDomain.validateProduct(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      let response;
      if (product) {
        response = await apiClient.put<Product>(
          `/products/${product.id}`,
          formData
        );
      } else {
        response = await apiClient.post<Product>("/products", formData);
      }

      if (response.success && response.data) {
        onSubmit?.(response.data);
      }
    } catch (err) {
      setErrors([
        err instanceof Error ? err.message : "Failed to save product",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof CreateProductRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "price" ? parseFloat(e.target.value) || 0 : e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Create Product"}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <ul className="text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Enter product description"
            rows={4}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange("price")}
            placeholder="Enter product price"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
