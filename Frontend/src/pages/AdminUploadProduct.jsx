import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminUploadProduct() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    shortDesc: "",
    stock: 0,
    price: 0,
    description: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, [name]: file }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the event bubbling
    try {
      const formdata = new FormData();
      for (let key in form) formdata.append(key, form[key]);
      const res = await api.post(`/product/add-product/`);
      console.log(res);
      navigate("/admin/dashboard/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Product Information</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
        />
        <input
          type="text"
          name="shortDesc"
          placeholder="Short Description"
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock quantity"
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          placeholder="Product Image"
          onChange={handleFileChange}
        />
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
}

export default AdminUploadProduct;
