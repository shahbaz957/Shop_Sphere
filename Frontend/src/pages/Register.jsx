import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    profileImage: null,
  });

  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      for (let key in form) formdata.append(key, form[key]);
      const res = await api.post("/user/register", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      setUser(res.data.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md p-8 rounded-2xl shadow-2xl 
          backdrop-blur-xl bg-white/10 border border-white/20 
          text-white space-y-6 
          transform transition-all duration-500 hover:scale-[1.02]
        "
      >
        <h1 className="text-3xl font-bold text-center mb-4 tracking-wide">
          Create Account
        </h1>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handlechange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
          focus:ring-2 focus:ring-blue-500 outline-none 
          placeholder-gray-300 text-white transition-all duration-300"
        />

        <input
          type="text"
          name="username"
          placeholder="UserName"
          onChange={handlechange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
          focus:ring-2 focus:ring-blue-500 outline-none 
          placeholder-gray-300 text-white transition-all duration-300"
        />

        <input
          type="text"
          name="email"
          placeholder="Email Address"
          onChange={handlechange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
          focus:ring-2 focus:ring-blue-500 outline-none 
          placeholder-gray-300 text-white transition-all duration-300"
        />

        <input
          type="text"
          name="password"
          placeholder="Type Password"
          onChange={handlechange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
          focus:ring-2 focus:ring-blue-500 outline-none 
          placeholder-gray-300 text-white transition-all duration-300"
        />

        <input
          type="file"
          name="profileImage"
          placeholder="Profile Image"
          onChange={handleFileChange}
          className="w-full text-gray-200 file:mr-4 file:py-2 file:px-4 
          file:rounded-md file:border-0 file:text-sm 
          file:bg-blue-600 file:text-white hover:file:bg-blue-700 
          transition-all duration-300 cursor-pointer"
        />
        <p className="text-sm text-gray-500 text-center">
          Already have an account?
          <span
            className="text-blue-600 hover:underline cursor-pointer ml-1"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <button
          type="submit"
          className="
          w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
          transition-all duration-300 font-semibold text-lg 
          shadow-lg hover:shadow-blue-500/30
        "
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
