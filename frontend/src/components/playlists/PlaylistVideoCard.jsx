import React from "react";
import { Trash2 } from "lucide-react";
import { removeVideoFromPlaylist } from "../../services/playlistServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PlaylistVideoCard = ({ videos = [], playlistId, onVideoRemoved }) => {
  const navigate = useNavigate();

  const handleRemove = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlistId, videoId);

      toast.success("Video removed from playlist!");
      onVideoRemoved?.();
    } catch (err) {
      toast.error("Failed to remove video.");
    }
  };

  if (videos.length === 0)
    return <p className="text-gray-400 text-center mt-6">No videos yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-8 ">
      {videos.map((video) => (
        <div
          key={video._id}
          className="bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
        >
          <div
            className="relative group"
            onClick={() => navigate(`/videos/${video._id}/watch`)}
          >
            <video
              src={video.videoFile}
              className="w-full h-48 object-cover pointer-events-none"
              muted
              preload="metadata"
            />
          </div>

          <div className="p-3 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="text-white font-medium text-base line-clamp-1 max-w-[80%]">
                {video.title}
              </h3>

              <button
                onClick={() => handleRemove(video._id)}
                className="bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition"
                title="Remove from playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={video?.owner?.avatar || "/default-avatar.png"}
                alt="Owner Avatar"
                className="w-6 h-6 rounded-full object-cover border border-gray-600"
              />
              <p className="text-sm text-gray-400">{video?.owner?.fullName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistVideoCard;
