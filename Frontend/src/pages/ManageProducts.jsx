import React from 'react'
import api from '../api/axios';
import { useState } from 'react';

function ManageProducts() {
    const [products , setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const res = await api.get(`/product/all-products/`);
            setProducts(res.data.data);
        } catch (error) {
            console.error(error.message)
        }

    } 

    fetchProducts();
    const handleDelete = async (id) => {
        try {
            await api.delete(`/product/${id}`)
            fetchProducts();
            
        } catch (error) {
            console.error(error.message)
        }
    }
    if (!products) return <h1>Products Are Fetching ...</h1>
    // Make built in Cards 
  return (
    <div>
        <h1>Products Available On your Store</h1>
        {products.length === 0 && <h1>No Product is Available</h1>}
        {products.map((item) => (
            <div key={item._id}>
                <img src={item.image.url} alt={item.title} />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <h3>{item.price}</h3>
                <button onClick={() => handleDelete(item._id)}>Delete Product</button>

            </div>
        ))}
    </div>
  )
}

export default ManageProducts