import "./App.css";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import { SearchProvider } from "./context/searchContext";
import Product from "./pages/ProductPage";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUploadProduct from "./pages/AdminUploadProduct";
import AdminManageOrders from "./pages/AdminManageOrders";
import ManageProducts from "./pages/ManageProducts";
function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart/:userId"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:productId"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/upload-product"
              element={
                <AdminProtectedRoute>
                  <AdminUploadProduct />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminProtectedRoute>
                  <AdminManageOrders />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-products"
              element={
                <AdminProtectedRoute>
                  <ManageProducts />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
