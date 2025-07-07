import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { updatePlaylist } from '../../services/playlistServices';

const UpdatePlaylistModal = ({ playlistId, onClose }) => {


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

 
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Close modal on outside click
  const handleBackdropClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    if (!name.trim() && !description.trim()) {
      setError("Please provide a new name or description.");
      return;
    }

    setLoading(true);
    try {
      const updatedFields = {};
      if (name.trim()) updatedFields.name = name;
      if (description.trim()) updatedFields.description = description;

      const response = await updatePlaylist(playlistId, updatedFields);
      setSuccess("Playlist updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-gray-900 text-white rounded-lg p-6 w-80 relative">
        <h3 className="text-lg font-semibold mb-4">Update Playlist</h3>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

        <input
          ref={nameInputRef}
          className="w-full p-2 mb-3 rounded-md bg-gray-800 text-white"
          placeholder="New Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 rounded-md bg-gray-800 text-white"
          placeholder="New Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Playlist"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePlaylistModal;
