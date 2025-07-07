import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById } from "../../services/playlistServices";
import PlaylistVideoCard from "./PlaylistVideoCard";

const GetSinglePlaylist = () => {
  const playlistId = useParams().id;
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setError("");
        const res = await getPlaylistById(playlistId);
        setPlaylist(res?.data);
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError("Failed to load playlist.");
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  console.log("playlist : ",playlist)

  const fetchUpdatedPlaylist = async () => {
    try {
      const res = await getPlaylistById(playlistId);
      setPlaylist(res?.data);
    } catch (err) {
      console.error("Error refreshing playlist:", err);
    }
  };

  if (error) return <p className="text-red-500 p-4 text-center">{error}</p>;
  if (!playlist)
    return <p className="text-gray-400 p-4 text-center">Loading playlist...</p>;

  const owner = playlist.owner || {};

  return (
    <div className="max-w-6xl mx-auto text-white px-4 py-8">
      {/* Playlist Header Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">{playlist.name}</h2>
        <p className="text-sm text-gray-400 max-w-xl">{playlist.description}</p>

        {/* Owner Info */}
        <div className="flex items-center gap-3 mt-6">
          <img
            src={owner.avatar || "/default-avatar.png"}
            alt="Owner Avatar"
            onClick={() => navigate(`/c/${owner.username}`)}
            className="w-12 h-12 rounded-full object-cover border border-gray-600 hover:ring-2 hover:ring-blue-500 cursor-pointer"
          />
          <div className="text-left">
            <p className="text-white font-semibold">
              {owner.fullName || "Unknown"}
            </p>
            <p className="text-sm text-gray-400">@{owner.username || "user"}</p>
          </div>
        </div>
      </div>

      {/* Playlist Videos */}
      <PlaylistVideoCard
        videos={playlist.videos}
        playlistId={playlist._id}
        onVideoRemoved={() => {
          fetchUpdatedPlaylist();
        }}
      />
    </div>
  );
};

export default GetSinglePlaylist;
