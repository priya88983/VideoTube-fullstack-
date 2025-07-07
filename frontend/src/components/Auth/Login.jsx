import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../../store/authSlice";
import { loginUser, getCurrentUser } from "../../services/authServices";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    const { identifier, password } = data;

    if (!identifier?.trim()) {
      setError("Please enter your username or email.");
      return;
    }

    const credentials = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(identifier)
      ? { email: identifier.trim(), password }
      : { username: identifier.trim(), password };

    try {
      const session = await loginUser(credentials);
      if (session) {
        const userData = await getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/all-videos");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1f1f1f] border border-[#333] rounded-2xl shadow-xl p-8 sm:p-10 text-white">
        <h2 className="text-center text-3xl font-bold text-red-500 mb-2">
          Sign in to your account
        </h2>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleSubmit(login)} className="mt-6 flex flex-col gap-5">
          <div>
            <label className="block mb-1 text-sm text-white">
              Username or Email
            </label>
            <input
              type="text"
              placeholder="Enter your username or email"
              {...register("identifier", { required: true })}
              className="w-full px-4 py-2 bg-[#0f0f0f] text-white border border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 bg-[#0f0f0f] text-white border border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
