import React, { useEffect, useState } from "react";
import { getUserPlaylists, deletePlaylist } from "../../services/playlistServices.js";
import { useNavigate } from "react-router-dom";
import OwnerMenu from "../OwnerMenu.jsx";
import { useSelector } from "react-redux";
import UpdatePlaylistModal from "./UpdatePlaylistModal.jsx";

const GetAllPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Fetch playlists
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

  if (error) {
    return <p className="text-red-500 text-center mt-10 text-lg">{error}</p>;
  }

  if (playlists.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-10 text-lg">
        No playlists found.
      </p>
    );
  }

  const delete_Playlist = async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Playlists</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] border border-[#333] p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            {/*  OwnerMenu for Update/Delete */}
            <div className="absolute top-3 right-3 z-10">
              <OwnerMenu
                onEdit={() => {
                  setSelectedPlaylistId(playlist._id);
                  setOpenUpdateModal(true);
                }}
                onDelete={async () => {
                  await delete_Playlist(playlist._id);
                  await fetchAllPlaylists();
                }}
              />
            </div>

            <h3 className="text-xl font-semibold mb-2 line-clamp-1">
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-400 mb-5 line-clamp-2">
              {playlist.description || "No description provided."}
            </p>

            <button
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-medium transition"
            >
              View Playlist
            </button>
          </div>
        ))}
      </div>

   
      {openUpdateModal && selectedPlaylistId && (
        <UpdatePlaylistModal
          playlistId={selectedPlaylistId}
          onClose={async () => {
            setOpenUpdateModal(false);
            setSelectedPlaylistId(null);
            await fetchAllPlaylists();
          }}
        />
      )}
    </div>
  );
};

export default GetAllPlaylists;
