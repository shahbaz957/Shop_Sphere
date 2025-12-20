import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [totalProd, setTotalProd] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalEar, setTotalEar] = useState(0);
  const [lowStProds, setLowStProds] = useState([]);
  const { user , setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const fetchAnalytics = async () => {
      try {
        const res1 = await api.get(`/product/product-count/`);
        setTotalProd(res1.data.data);

        const res2 = await api.get(`/order/sale-earning/`);
        setTotalEar(res2.data.data.earning);
        setTotalSales(res2.data.data.sales);

        const res3 = await api.get(`/user/admin/total-user/`);
        setTotalUser(res3.data.data);

        const res4 = await api.get(`/product/product-low/`);
        setLowStProds(res4.data.data);
      } catch (error) {
        console.error(error.message);
      }
    };
  useEffect(() => { 
    fetchAnalytics();
  }, []);
  const handleLogout = async () => {
    try {
      const res = await api.post("/user/logout");
      // console.log(res);
      
      setUser(null);
      localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {user && (
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
          >
            Logout
          </button>
        )}
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
        <img
          src={user.profileImage.url}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.fullName}
          </h1>
          <p className="text-gray-500">Administrator Dashboard</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <DashboardCard title="Total Products" value={totalProd} />
        <DashboardCard title="Total Sales" value={totalSales} />
        <DashboardCard title="Total Earnings" value={`$ ${totalEar}`} />
        <DashboardCard title="Total Customers" value={totalUser} />
      </div>

      {/* Low Stock Products */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Low Stock Products
        </h2>

        {lowStProds.length === 0 ? (
          <p className="text-gray-500">No low stock products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStProds.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 text-red-600 font-semibold">
                      {item.stock}
                    </td>
                    <td className="p-3">$ {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <ActionButton
          label="Upload Product"
          onClick={() => navigate("/admin/upload-product")}
        />
        <ActionButton
          label="Manage Orders"
          onClick={() => navigate("/admin/orders")}
        />
        <ActionButton
          label="Manage Products"
          onClick={() => navigate("/admin/manage-products")}
        />
      </div>
    </div>
  );
}

/* Reusable Components */

const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition font-semibold"
  >
    {label}
  </button>
);

export default AdminDashboard;
