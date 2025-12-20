import React, { useState } from "react";
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
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      for (let key in form) {
        formdata.append(key, form[key]);
      }

      await api.post("/product/add-product/", formdata);
      navigate("/admin/dashboard/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Upload New Product
        </h1>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          onChange={handleChange}
          className="input"
        />

        {/* Category */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="input"
        />

        {/* Short Description */}
        <input
          type="text"
          name="shortDesc"
          placeholder="Short Description"
          onChange={handleChange}
          className="input"
        />

        {/* Stock & Price */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleChange}
            className="input"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (PKR)"
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Full Product Description"
          rows="4"
          onChange={handleChange}
          className="input resize-none"
        />

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-600
              hover:file:bg-blue-100"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}

export default AdminUploadProduct;
