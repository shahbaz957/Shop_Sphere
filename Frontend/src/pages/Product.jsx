import React from "react";
import { useState } from "react";
import api from "../api/axios";
import { useEffect } from "react";

function Product({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const fetchProduct = async (product_Id) => {
    try {
      const res = await api.get(`product/${product_Id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDec = () => {
    setQuantity((prev) => prev - 1);
  };
  const handleInc = () => {
    setQuantity((prev) => prev + 1);
  };
  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  return (
    <div>
      <div>
        <img src={product.image.url} alt={product.image.title} />
      </div>
      <div>
        <h1>Available Stock</h1>
        <p>{product.stock}</p>
      </div>
      <div>
        <h2>Quantity</h2>
        <button onClick={handleDec} disabled={quantity === 1}>
          ➖
        </button>
        <p>{quantity}</p>
        <button onClick={handleInc} disabled={quantity === product.stock}>
          ➕
        </button>
      </div>
      <div>
        <h1>{product.title}</h1>
        <h2>{product.category}</h2>
        <h3>{product.price}</h3>
        <p>{product.description}</p>
      </div>

      <div className="flex">
        <button>CheckOut</button>
        <button>Add To Cart🛒</button>
      </div>
    </div>
  );
}

export default Product;
