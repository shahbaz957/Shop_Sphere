import React, { useState, useEffect } from "react";
import api from "../api/axios";

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/order/all-orders`);
      setOrders(res.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCheck = async (id) => {
    try {
      await api.post(`/order/toggle-order/${id}`);
      fetchOrders(); // Refresh list to show updated status
    } catch (error) {
      console.error("Error updating order:", error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Total Orders: {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-500">
              No Orders Found
            </h2>
            <p className="text-gray-400">
              When customers buy products, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Order Detail
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Status/Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.userId?.fullName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {item._id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 font-medium">
                        {item.productId?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {item.quantity}
                        </span>{" "}
                        x ${item.UnitPrice}
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        Total: ${(item.quantity * item.UnitPrice).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleCheck(item._id)}
                        className={`p-2 rounded-lg border transition-all duration-200 
                                                    ${
                                                      item.status ===
                                                      "completed"
                                                        ? "bg-green-100 border-green-200 text-green-600 hover:bg-green-200"
                                                        : "bg-white border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500 shadow-sm"
                                                    }`}
                        title="Toggle Order Status"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageOrders;
