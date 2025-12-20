import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Product from "../components/Product";
import BackButton from "../components/BackButton";
import CartProducts from "../components/CartProducts";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCartProducts = async () => {
    try {
      const res = await api.get("/cart/all-cart/");
      setCartProducts(res.data.data.cart.Items);
      setTotal(res.data.data.total);
      console.log("printing this : " , res.data.data.cart.Items);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">
        Total Products in Cart: {total}
      </h1>

      {cartProducts.length === 0 && (
        <h2 className="text-gray-500">No Product in Cart Yet</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartProducts.map((item) => (
          <CartProducts
            key={item._id}
            product={item.ProductId}
            refreshCart={fetchCartProducts}
          />
        ))}
      </div>
    </div>
  );
}

export default Cart;
