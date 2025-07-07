import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateVideo } from '../../services/videoServices';
import Input from '../utilities/Input.jsx';
import Button from '../utilities/Button.jsx';

const UpdateVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const uploadVideo = async (data) => {
    setError('');
    setSuccess('');

    console.log(" Video ID:", id);
    console.log(" Form data received:", data);

    try {
      const formData = new FormData();

      if (data.title?.trim()) {
        formData.append("title", data.title);
      }

      if (data.description?.trim()) {
        formData.append("description", data.description);
      }

      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      // Debug log for FormData
      console.log(" Final FormData:");
      

      const updatedVideo = await updateVideo(id, formData);
      console.log("Updated video response:", updatedVideo);

      if (updatedVideo) {
        setSuccess("Video updated successfully ");

        setTimeout(() => {
          navigate("/all-videos");
        }, 1500);
      }
    } catch (error) {
      console.error(" Error updating video:", error);
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">📹 Update Video</h2>

      {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-center text-sm">{success}</p>}

      <form onSubmit={handleSubmit(uploadVideo)} className="space-y-5">
        <Input
          label="Title"
          placeholder="Update title"
          {...register("title")}
        />

        <Input
          label="Description"
          placeholder="Update description..."
          {...register("description" ,)}
        />

        <div>
          <label className="block font-medium mb-1">Update Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail")}
            className="block w-full text-sm border border-gray-300 p-2 rounded"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Video
        </Button>
      </form>
    </div>
  );
};

export default UpdateVideo;
