import React, { useState, useEffect } from "react";
import api from "../api/axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/product/all-products?limit=10`);
      setProducts(res.data.data.products);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to prevent infinite re-renders
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    // Optimistically remove from UI immediately
    setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));

    try {
      await api.delete(`/product/${id}`);
      // Optional: refresh to ensure sync with server
      fetchProducts();
      window.location.reload();
    } catch (error) {
      console.error(error.message);
      // Revert on error by refetching
      fetchProducts();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-xl font-medium text-gray-500">
          Fetching your store inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Products
            </h1>
            <p className="text-gray-500 mt-1">
              Inventory overview for your store.
            </p>
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="text-sm font-semibold text-gray-400 uppercase">
              Items:{" "}
            </span>
            <span className="text-lg font-bold text-blue-600">
              {products.length}
            </span>
          </div>
        </header>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800">
              No Products Available
            </h2>
            <p className="text-gray-500">Add some products to see them here.</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={item.image.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                    ${item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-1 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;
