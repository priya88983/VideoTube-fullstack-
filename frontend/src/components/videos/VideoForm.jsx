import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../utilities/Button.jsx";
import Input from "../utilities/Input.jsx";
import { publishVideo } from "../../services/videoServices.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const VideoForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue
  } = useForm({

    defaultValues: {
      title: "",
      description: "",
      slug: "",
      status: "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);


  const [error,setErrror]=useState("")
  const[success,setSuccess] = useState("")

  const uploadVideo = async (data) => {
    setErrror("");
    setSuccess("")

    console.log( "data received in frontend: ", data)

  try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("video", data.video[0]);
      formData.append("thumbnail", data.thumbnail[0]);
  
    const publishedVideo = await publishVideo(formData);

    if (publishedVideo) {
      setSuccess("Video uploaded successfully ✅");

      
      setTimeout(() => {
        navigate("/all-videos");
      }, 1500);
    }
  } catch (error) {
    
    setErrror(error.message);
  }

  
  };

  return (
    
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">📹 Publish New Video</h2>

           {error && <p className="text-red-500 mt-6 text-center text-sm">{error}</p>}
           {success && <p className="text-green-500 mt-6 text-center text-sm">{success}</p>}

      <form onSubmit={handleSubmit(uploadVideo)} className="space-y-5">
        <Input
          label="Title"
          placeholder="Enter video title"
          {...register("title", { required: true })}
        />

        <Input
          label="Description"
          placeholder="Write a short description..."
          {...register("description", { required: true })}
        />

        <Input
          label="Slug (optional)"
          placeholder="Auto-generated or enter manually"
          {...register("slug")}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value))
          }
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Upload Video *</label>
            <input
              type="file"
              accept="video/*"
              {...register("video", { required: true })}
              className="block w-full text-sm border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Thumbnail *</label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail", { required: true })}
              className="block w-full text-sm border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Publish Video
        </Button>
      </form>
    </div>
  );
};

export default VideoForm;
