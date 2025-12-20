import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [totalProd, setTotalProd] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalEar, setTotalEar] = useState(0);
  const [lowStProds, setLowStProds] = useState([]);
  const { user } = useContext(AuthContext);
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
  fetchAnalytics();
  if (!lowStProds) return <h1>Data is Fetching ....... </h1>;

  return (
    <div>
      <div>
        <img src={user.profileImage.url} alt={user.username} />
        <h1>{user.fullName}</h1>
      </div>
      <div>
        <div>
          <h2>Total Products : {totalProd}</h2>
          <h2>Total Earning : {totalSales}</h2>
        </div>
        <div>
          <h2>Total Earning : {totalEar}</h2>
          <h2>Total Customers : {totalUser}</h2>
        </div>
      </div>
      <div>
        {lowStProds.length === 0 && <h2>No Low Stock Product is available</h2>}
        {lowStProds.map((item) => (
          <div key={item._id}>
            <h2>{item.title}</h2>
            <p>{item.category}</p>
            <p>{item.stock}</p>
            <p>{item.price}</p>
          </div>
        ))}
      </div>

      {/* Buttons Section */}

      <div>
        <button onClick={() => navigate(`/admin/upload-product`)}>Upload Product</button>
        <button onClick={() => navigate(`/admin/orders`)}>Manage Orders</button>
        <button onClick={() => navigate(`/admin/manage-products`)}>Manage Products</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
