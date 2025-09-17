import React, { useState, useEffect } from "react";
import { Product, ProductDomain } from "../../modules/product/Product";
import { apiClient } from "../shared/api";
import { Button } from "../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/components/ui/table";

interface ProductBrowserProps {
  onSelectProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Product[]>("/products");
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await apiClient.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      onDeleteProduct?.(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
        <Button onClick={loadProducts} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={loadProducts}>Refresh</Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No products found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.description}
                </TableCell>
                <TableCell>
                  {ProductDomain.formatPrice(product.price)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onSelectProduct && (
                      <Button
                        size="sm"
                        onClick={() => onSelectProduct(product)}
                      >
                        Select
                      </Button>
                    )}
                    {onEditProduct && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};