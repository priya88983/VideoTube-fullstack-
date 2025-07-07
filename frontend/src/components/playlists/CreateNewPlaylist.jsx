import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPlaylist } from '../../services/playlistServices.js'; // ✅ Correct import path for frontend service
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const CreateNewPlaylist = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const create_playlist = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await createPlaylist({
        name: data.name,
        description: data.description
      });

      if (res?.success) {
        setSuccess("✅ Playlist created successfully!");
        reset();

        setTimeout(() => {
          setSuccess("");
          onClose(); // Close modal after success
        }, 1500);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target.classList.contains("modal-backdrop")) {
          onClose();
        }
      }}
    >
      <div className="modal-backdrop bg-[#1a1a1a] rounded-lg p-6 w-96 relative shadow-lg text-white">
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* 🎯 Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">Create New Playlist</h2>

        {/* 📝 Form */}
        <form onSubmit={handleSubmit(create_playlist)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Playlist Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. My Study Playlist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your playlist..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-sm font-medium transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPlaylist;
