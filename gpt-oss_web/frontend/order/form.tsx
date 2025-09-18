import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Order, Prisma } from '../modules/order';
import { Product } from '../modules/product';
import { Button } from 'shadcn/ui/button';

export const OrderForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Partial<Order>>({
    customerId: 1,
    items: [],
    status: 'Pending',
  });

  // Load products for selection
  useEffect(() => {
    api<Product[]>('/api/products').then(setProducts);
  }, []);

  const addItem = (product: Product) => {
    setOrder((prev) => ({
      ...prev,
      items: [...(prev.items ?? []), { productId: product.id, quantity: 1, price: product.price }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...order, total: (order.items ?? []).reduce((s, i) => s + i.price * i.quantity, 0) };
    await api('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    alert('Order created!'); // simple feedback
  };

  return (
    <form className="grid grid-cols-1 gap-4 max-w-md" onSubmit={handleSubmit}>
      <label>
        Customer ID
        <input type="number" name="customerId" value={order.customerId ?? ''} onChange={(e) => setOrder((prev) => ({ ...prev, customerId: Number(e.target.value))).toFixed(2)} className="border rounded p-2 w-full" required />
      </label>
      <div className="space-y-2">
        <h3 className="font-medium">Items</h3>
        <div className="flex gap-2">
          {products.map((p) => (
            <Button key={p.id} variant="outline" size="sm" onClick={() => addItem(p)}>
              {p.name}
            </Button>
          ))}
        </div>
        <ul>
          {(order.items ?? []).map((i, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{i.quantity} x {i.price.toFixed(2)}</span>
              <span>{(i.quantity * i.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <select name="status" value={order.status} onChange={(e) => setOrder((prev) => ({ ...prev, status: e.target.value }))} className="border rounded p-2">
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
      <Button type="submit">Create Order</Button>
    </form>
  );
};