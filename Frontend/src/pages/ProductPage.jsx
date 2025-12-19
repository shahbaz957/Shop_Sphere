import React from "react";
import { useState } from "react";
import api from "../api/axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const fetchProduct = async (product_Id) => {
    try {
      const res = await api.get(`product/${product_Id}`);
      console.log(res);
      setProduct(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleAddCart = async (id) => {
    try {
      await api.post(`/cart/add-cart/${id}`);
    } catch (error) {
      console.error(error?.message);
    }
  };

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const navigate = useNavigate();

  if (!product) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <BackButton />
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE IMAGE */}
        <div className="flex justify-center lg:justify-start">
          <img
            src={product.image.url}
            alt={product.image.title}
            className="w-full max-w-md rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Stock */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-fit">
            <h1 className="text-sm font-semibold text-green-700">
              Available Stock
            </h1>
            {product.stock === 0 ? (
              <h2 className="text-red-600 font-extrabold">Out of Stock</h2>
            ) : (
              <p className="text-2xl font-bold text-green-800">
                {product.stock}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-14 bg-white rounded-2xl shadow-md p-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

        <h2
          className="inline-block bg-blue-100 text-blue-700 
                       px-4 py-1 rounded-full text-sm font-semibold"
        >
          {product.category}
        </h2>

        <h3 className="text-2xl font-extrabold text-red-500">
          $ {product.price}
        </h3>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-10 flex gap-6 justify-center">
        <button
          className="px-8 py-3 rounded-xl bg-black text-white 
                     hover:bg-gray-800 transition font-semibold"
          onClick={() => navigate(`/checkout/${product._id}`)}
        >
          CheckOut
        </button>

        <button
          onClick={() => handleAddCart(product._id)}
          className="px-8 py-3 rounded-xl bg-red-500 text-white 
                     hover:bg-red-600 transition font-semibold"
        >
          Add To Cart 🛒
        </button>
      </div>
    </div>
  );
}

export default Product;
