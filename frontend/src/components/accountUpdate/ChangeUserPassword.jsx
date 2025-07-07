import React, { useState } from 'react';
import { Button, Input } from '../index.js';
import { getCurrentUser, ChangePassword } from '../../services/authServices.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const ChangeUserPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const change_password = async (data) => {
    setError("");

    if (data.newPassword !== data.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const userData = await getCurrentUser();

      if (!userData) {
        navigate("/login");
        return;
      }

      await ChangePassword(data);
      navigate(`/c/${userData.username}`);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-xl p-8 border border-[#2a2a2a]">
        <h2 className="text-center text-2xl font-semibold text-white">
          Change Password
        </h2>

        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit(change_password)} className="mt-6 flex flex-col gap-5">
          <Input
            label="Old Password"
            labelClassName="text-gray-300"
            placeholder="Enter your old password"
            type="password"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("oldPassword", { required: true })}
          />

          <Input
            label="New Password"
            labelClassName="text-gray-300"
            type="password"
            placeholder="Enter your new password"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("newPassword", { required: true })}
          />

          <Input
            label="Confirm New Password"
            labelClassName="text-gray-300"
            type="password"
            placeholder="Confirm new password"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("confirmPassword", { required: true })}
          />

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 transition"
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangeUserPassword;
