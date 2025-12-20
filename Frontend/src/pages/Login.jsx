import React, { useContext, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Login() {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    password: "",
    email: "",
  });

  const {setUser} = useContext(AuthContext)

  const handleChange = (e) => {
    setLoginInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", loginInfo);
      console.log("THis is response >>>>> " , res , "Ended here");
      const user_ = res.data.data.user
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user_);
      if (user_.isAdmin){
        navigate('/admin/dashboard');
      }else {
        navigate("/home");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">Login</h2>

        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account?
          <span
            className="text-indigo-600 hover:underline cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
