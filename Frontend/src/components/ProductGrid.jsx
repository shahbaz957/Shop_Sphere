import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/searchContext";
import api from "../api/axios";
import Pagination from "../components/Pagination.jsx";
import Product from "./Product.jsx";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { query } = useContext(SearchContext);

  const fetchProducts = async (page) => {
    const res = await api.get(`/product/all-products?page=${page}&limit=10`);
    setProducts(res.data.data.products);
    setPage(res.data.data.page);
    setTotalPages(res.data.data.totalPages);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const filteredProducts = products?.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      {/* Page heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Browse Products
      </h2>

      {/* Products Grid */}
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-6
        max-w-7xl 
        mx-auto
      "
      >
        {products &&
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="
                bg-white 
                shadow-md 
                rounded-xl 
                overflow-hidden 
                border 
                border-gray-200 
                hover:shadow-xl 
                hover:-translate-y-1 
                transition 
                duration-200
              "
            >
              <Product product={product} />
            </div>
          ))}
          {filteredProducts.length === 0 && <h2>No Product Found</h2>}
      </div>

      {/* Pagination Section */}
      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onClickPage={(value) => setPage(value)}
        />
      </div>
    </div>
  );
}

export default ProductGrid;
