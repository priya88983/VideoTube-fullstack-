import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getUserPlaylists, addVideoToPlaylist } from '../../services/playlistServices';
import { X } from "lucide-react";
import CreatePlaylistModal from './CreateNewPlaylistModal';

const PlaylistModal = ({ onClose }) => {
  const modalRef = useRef();
  const videoId = useParams().id;

  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false); // ✅

  const handleBackdropClick = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      const res = await getUserPlaylists();
      setPlaylists(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setError("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  const handleAddVideo = async (playlistId) => {
    setError("");
    setSuccess("");
    try {
      await addVideoToPlaylist(playlistId, videoId);
      setSuccess("✅ Video added to playlist");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error adding video:", err.message);
      setError(" Failed to add video to playlist");
    }
  };

  const handleNewPlaylistCreated = async (newPlaylist) => {
    setPlaylists((prev) => [...prev, newPlaylist]);
    setOpenCreateModal(false);
   
  };

  return (
    <>
      <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center "
      >
        <div className="bg-gray-900 text-white rounded-lg p-6 w-80 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold mb-4">Select Playlist</h2>

          {success && <p className="text-green-400 text-sm mb-2">{success}</p>}
        

          {playlists.length === 0 ? (
            <p className="text-gray-400 text-sm">No playlists found.</p>
          ) : (
            <ul className="space-y-3">
              {playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  onClick={() => handleAddVideo(playlist._id)}
                  className="cursor-pointer px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setOpenCreateModal(true)}
            className="mt-4 w-full text-sm text-blue-400 hover:underline"
          >
            + Create New Playlist
          </button>
        </div>
      </div>

      {openCreateModal && (
        <CreatePlaylistModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={handleNewPlaylistCreated}
        />
      )}
    </>
  );
};

export default PlaylistModal;
