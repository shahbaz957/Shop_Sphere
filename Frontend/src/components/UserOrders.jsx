import React from "react";
import api from "../api/axios";

function UserOrders({ order, refreshOrders }) {
  const handleDelete = async (orderId) => {
    await api.delete(`/order/delete/${orderId}`);
    if (refreshOrders) refreshOrders();
  };

  return (
    <div className="grid grid-cols-6 items-center py-3 border-b text-gray-700">
      <p className="font-medium">{order.productId?.title}</p>
      <p>{order.quantity}</p>
      <p>${order.UnitPrice}</p>
      <p className="font-semibold">${order.UnitPrice * order.quantity}</p>
      <p
        className={`font-semibold ${
          order.status === "Pending" ? "text-orange-500" : "text-green-600"
        }`}
      >
        {order.status}
      </p>

      {order.status === "Pending" ? (
        <button
          onClick={() => handleDelete(order._id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </div>
  );
}

export default UserOrders;
