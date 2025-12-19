import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import UserOrders from "../components/UserOrders";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function UserProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [delivered, setDelivered] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/order/`);
      setPending(res.data.data.pending);
      setDelivered(res.data.data.delivered);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BackButton />
      {/* Profile Header */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-md w-80">
        <img
          src={user.profileImage.url}
          alt={user.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-8 space-y-10">
        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Pending Orders
          </h2>

          {/* Table Header */}
          <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2">
            <p>Product</p>
            <p>Quantity</p>
            <p>Unit Price</p>
            <p>Total Price</p>
            <p>Status</p>
            <p>Action</p>
          </div>

          {pending.length === 0 && (
            <p className="text-gray-400 mt-4">No Pending Products Yet</p>
          )}

          {pending.map((item) => (
            <UserOrders
              key={item._id}
              order={item}
              refreshOrders={fetchOrders}
            />
          ))}
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md  w-250">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Delivered Orders
          </h2>

          {/* Table Header */}
          <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2">
            <p>Product</p>
            <p>Quantity</p>
            <p>Unit Price</p>
            <p>Total Price</p>
            <p>Status</p>
          </div>

          {delivered.length === 0 && (
            <p className="text-gray-400 mt-4">No Delivered Products Yet</p>
          )}

          {delivered.map((item) => (
            <UserOrders
              key={item._id}
              order={item}
              refreshOrders={fetchOrders}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-10 flex justify-center">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate(`/cart/${user._id}`)}
        >
          Check Cart 🛒
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
