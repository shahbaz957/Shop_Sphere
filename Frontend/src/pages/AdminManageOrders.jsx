import React from 'react'
import api from '../api/axios';
import { useState } from 'react';

function AdminManageOrders() {
    const [orders , setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/order/all-orders`);
            console.log(res)
            setOrders(res.data.data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleCheck = async (id) => {
        try {
            await api.post(`/order/toggle-order/${id}`);
            fetchOrders();
        } catch (error) {
            console.error(error.message)
        }
    }
  return (
    <div>
        {orders.length === 0 && <h1>No Orders Yet</h1>}
        {/* Here it should have the table header according to the div in map */}
        {orders.map((item) =>{
            <div key={item.key}>
                <h2>{item.userId.fullName}</h2>
                <h2>{item.productId.title}</h2>
                <h2>{item.quantity} * {item.UnitPrice}</h2>
                <button onClick={() => handleCheck(item._id)}>✅</button>
            </div>
        })}
    </div>
  )
}

export default AdminManageOrders