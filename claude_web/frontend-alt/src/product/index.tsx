import React, { useState } from "react";
import type { Product } from "../../../modules/product/Product";
import { ProductBrowser } from "./ProductBrowser";
import { ProductForm } from "./ProductForm";
import { Button } from "../shared/components/ui/button";

type ViewMode = "browser" | "form";

export const ProductPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setViewMode("form");
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setViewMode("form");
  };

  const handleFormSubmit = (product: Product) => {
    setViewMode("browser");
    setSelectedProduct(null);
  };

  const handleFormCancel = () => {
    setViewMode("browser");
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === "browser" ? (
        <div>
          <div className="mb-6">
            <Button onClick={handleCreateNew}>Create New Product</Button>
          </div>
          <ProductBrowser
            onEditProduct={handleEdit}
            onDeleteProduct={() => {
              // Browser handles the deletion internally
            }}
          />
        </div>
      ) : (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
