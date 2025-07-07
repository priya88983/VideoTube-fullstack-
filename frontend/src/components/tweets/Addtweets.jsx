import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createTweet } from "../../services/tweetServices";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTweets = () => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setErrror] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const create_tweet = async (data) => {
    setErrror("");
    setSuccess("");
    setLoading(true);

    try {
      const createdTweet = await createTweet({ content: data.content });
      if (createdTweet) {
        setSuccess("Tweet created successfully");
        setTimeout(() => {
          navigate("/all-videos");
        }, 1500);
      }
    } catch (error) {
      setErrror(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-[#181818] text-white p-6 rounded-xl w-full max-w-2xl shadow-2xl border border-gray-700">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <img
            src={userData?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-semibold text-lg">{userData?.fullName}</p>
            <p className="text-sm text-gray-400">Visibility: Public</p>
          </div>
        </div>

        {/* Textarea Form */}
        <form onSubmit={handleSubmit(create_tweet)}>
          <textarea
            {...register("content", { required: true })}
            placeholder="What's happening?"
            rows="4"
            className="w-full bg-[#0f0f0f] p-4 rounded-lg text-white border border-gray-700 outline-none resize-none mb-4 focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 text-sm rounded-md border border-gray-600 text-gray-300 hover:text-red-400 hover:border-red-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 text-sm rounded-md font-medium transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Message */}
          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          {success && <p className="text-green-500 mt-3 text-sm">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddTweets;
