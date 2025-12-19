import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import BackButton from "../components/BackButton";

function Checkout() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${productId}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleOrder = async () => {
    try {
      const body = { quantity, address };
      await api.post(`/order/${product._id}`, body);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDec = () => setQuantity((prev) => Math.max(prev - 1, 0));
  const handleInc = () =>
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  const handleChange = (e) => setAddress(e.target.value);

  if (!product)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Checkout
      </h1>

      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-xl p-6">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={product.image.url}
            alt={product.title}
            className="object-contain h-full"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.title}
            </h2>
            <p className="text-gray-500 mt-1 line-clamp-3">
              {product.description}
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              Available Stock:{" "}
              <span className="font-bold">{product.stock}</span>
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <button
              onClick={handleDec}
              disabled={quantity === 0}
              className="px-3 py-1 bg-white border rounded-lg shadow hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ➖
            </button>
            <span className="text-lg font-bold w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={handleInc}
              disabled={quantity === product.stock}
              className="px-3 py-1 bg-white border rounded-lg shadow hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ➕
            </button>
          </div>

          {/* Address Input */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Delivery Address
            </label>
            <input
              type="text"
              value={address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total and Button */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xl font-bold text-red-500">
              Total: ${quantity * product.price}
            </p>
            <button
              onClick={handleOrder}
              className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
