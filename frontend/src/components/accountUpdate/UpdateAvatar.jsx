import React, { useState, useEffect } from 'react';
import { Button, Input } from '../index.js';
import { getCurrentUser, updateAvatar } from '../../services/authServices.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const UpdateAvatar = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const watchAvatar = watch("avatar");

  useEffect(() => {
    if (watchAvatar && watchAvatar[0]) {
      const file = watchAvatar[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [watchAvatar]);

  const change_avatar = async (data) => {
    setError("");

    try {
      const userData = await getCurrentUser();
      if (!userData) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", data.avatar[0]);

      await updateAvatar(formData);
      navigate(`/c/${userData.username}`);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-xl p-8 border border-[#2a2a2a]">
        <h2 className="text-center text-2xl font-semibold text-white">
          Update Avatar
        </h2>

        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}

        {preview && (
          <div className="flex justify-center mt-4">
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-[#444]"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(change_avatar)} className="mt-6 flex flex-col gap-5">
          <Input
            label="Choose New Avatar"
            type="file"
            labelClassName="text-gray-300"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("avatar", { required: true })}
          />

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 transition"
          >
            Upload Avatar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAvatar;
