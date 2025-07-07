import React, { useState } from 'react';
import { createPlaylist } from '../../services/playlistServices';

const CreatePlaylistModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {

    setError("");
    try {
      setLoading(true);
      const res = await createPlaylist({ name, description });
      onSuccess(res.data); 
    } catch (err) {
      setError(err.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-80 relative">
        <h3 className="text-lg font-semibold mb-4">Create New Playlist</h3>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <input
          className="w-full p-2 mb-3 rounded-md bg-gray-800 text-white"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 rounded-md bg-gray-800 text-white"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Playlist"}
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

export default CreatePlaylistModal;
