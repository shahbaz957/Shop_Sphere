import React from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function CartProducts({ product, refreshCart }) {
  const handleDeleteCart = async (id) => {
    try {
      await api.delete(`/cart/delete-cart/${id}`);
      if (refreshCart) refreshCart();
    } catch (error) {
      console.error(error.message);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col p-4 bg-white h-full">
      {/* Product Image */}
      <Link to={`/product/${product?._id}`}>
        <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product?.image.url}
            alt="ProductImage"
            className="object-contain h-full"
          />
        </div>
      </Link>

      {/* Title */}
      <h2 className="mt-3 text-lg font-semibold text-gray-800 line-clamp-2">
        {product?.title}
      </h2>

      {/* Short Description */}
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {product?.shortDesc}
      </p>

      {/* Price */}
      <p className="mt-2 text-xl font-bold text-red-500">${product?.price}</p>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleDeleteCart(product?._id)}
          className="
            flex-1
            bg-red-500 
            text-white 
            py-2 
            rounded-lg 
            hover:bg-red-600 
            transition
            font-medium
          "
        >
          Delete from Cart
        </button>

        <button
          onClick={() => navigate(`/checkout/${product?._id}`)}
          className="
            flex-1
            bg-green-500 
            text-white 
            py-2 
            rounded-lg 
            hover:bg-green-600 
            transition
            font-medium
          "
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default CartProducts;
