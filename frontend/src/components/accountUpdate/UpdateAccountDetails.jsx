import React, { useState } from 'react';
import { Button, Input } from '../index.js';
import { getCurrentUser, updateAccount } from '../../services/authServices.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const UpdateAccountDetails = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const updateAccountdetails = async (data) => {
    if (!data.email || !data.fullName) {
      setError("Email and full name are required.");
      return;
    }

    setError("");

    try {
      const userData = await getCurrentUser();
      if (!userData) {
        navigate("/login");
        return;
      }

      await updateAccount(data);
       navigate(`/c/${userData.username}`);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-xl p-8 border border-[#2a2a2a]">
        <h2 className="text-center text-2xl font-semibold text-white">
          Update Account Details
        </h2>

        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleSubmit(updateAccountdetails)} className="mt-6 flex flex-col gap-5">
          <Input
            label="Email"
            labelClassName="text-gray-300"
            placeholder="Enter your email"
            type="email"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("email")}
          />

          <Input
            label="Full Name"
            labelClassName="text-gray-300"
            placeholder="Enter your full name"
            type="text"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("fullName")}
          />

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 transition"
          >
            Update Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccountDetails;
