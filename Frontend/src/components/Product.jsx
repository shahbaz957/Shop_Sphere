import React from 'react'
import api from '../api/axios'

function Product({ product }) {

  const handleCart = async (id) => {
    try {
      const res = await api.post(`/cart/add-cart/${id}`);
      console.log(res);
    } catch (error) {
      console.error(error?.message);
    }
  };

  const handleCheckout = () => {};

  return (
    <div className="flex flex-col p-4 bg-white h-full">

      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image.url}
          alt="ProductImage"
          className="object-contain h-full"
        />
      </div>

      {/* Title */}
      <h2 className="mt-3 text-lg font-semibold text-gray-800 line-clamp-2">
        {product.title}
      </h2>

      {/* Short Description */}
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {product.shortDesc}
      </p>

      {/* Price */}
      <p className="mt-2 text-xl font-bold text-red-500">
        ${product.price}
      </p>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleCart(product._id)}
          className="
            flex-1
            bg-blue-500 
            text-white 
            py-2 
            rounded-lg 
            hover:bg-blue-600 
            transition
            font-medium
          "
        >
          Add to Cart
        </button>

        <button
          onClick={handleCheckout}
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

export default Product;
