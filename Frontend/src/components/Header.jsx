import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SearchBar from "./SearchBar";

function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post("/user/logout");
      // console.log(res);

      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <header className="flex items-center justify-between p-4 border-b shadow-sm bg-gray-100">
      {/* Logo */}
      <Link to="/home" className="flex items-center">
        <h1 className="text-3xl font-extrabold text-indigo-600 tracking-wide">
          ShopSphere
        </h1>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center mx-6">
        <SearchBar />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Profile */}
        {user && (
          <Link to={`/profile/${user._id}`} className="relative">
            <img
              src={user.profileImage?.url || "/default-avatar.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-600"
            />
          </Link>
        )}

        {/* Logout Button */}
        {user && (
          <button
            onClick={() => navigate(`/cart/${user._id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
          >
            My Cart
          </button>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
