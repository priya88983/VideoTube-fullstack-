import React, { useState, useEffect } from 'react';
import { Button, Input } from '../index.js';
import { getCurrentUser, updateCoverImage } from '../../services/authServices.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const UpdateCoverImage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const watchCover = watch("coverImage");

  useEffect(() => {
    if (watchCover && watchCover[0]) {
      const file = watchCover[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [watchCover]);

  const change_cover = async (data) => {
    setError("");
    try {
      const userData = await getCurrentUser();
      if (!userData) {
        navigate("/login");
        return;
      }
      console.log("userdata:",userData)

      const formData = new FormData();
      formData.append("coverImage", data.coverImage[0]);

      await updateCoverImage(formData);
      navigate(`/c/${userData.username}`);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-lg bg-[#181818] rounded-2xl shadow-xl p-8 border border-[#2a2a2a]">
        <h2 className="text-center text-2xl font-semibold text-white">
          Update Cover Image
        </h2>

        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}

        {preview && (
          <div className="flex justify-center mt-4">
            <img
              src={preview}
              alt="Cover Preview"
              className="w-full h-40 object-cover rounded-md border border-[#444]"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(change_cover)} className="mt-6 flex flex-col gap-5">
          <Input
            label="Select a Cover Image"
            type="file"
            labelClassName="text-gray-300"
            className="bg-[#1f1f1f] border border-[#333] text-white"
            {...register("coverImage", { required: true })}
          />

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 transition"
          >
            Upload Cover
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCoverImage;
