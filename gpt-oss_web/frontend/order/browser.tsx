import React, { useEffect, useState } from "react";
import { Order } from "../modules/order";
import { api } from "../utils/api";
import { Button } from "shadcn/ui/button";

export const OrderBrowser: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const list = await api<Order[]>("/api/orders");
      setOrders(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this order?")) return;
    await api<void>(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total Items</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2">{o.customer?.name ?? "Unknown"}</td>
                <td className="px-4 py-2">{o.items?.length ?? 0}</td>
                <td className="px-4 py-2">{o.status ?? "Pending"}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Edit not implemented")}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(o.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};