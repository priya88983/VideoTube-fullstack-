// WatchVideo.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getCurrentUser } from "../../services/authServices";
import { watchVideo, deleteVideo } from "../../services/videoServices";
import GetAllComments from "../../components/comments/GetAllComments";
import AddComment from "../../components/comments/AddComments";
import VideoLike from "../../components/like/VideoLike";
import OwnerMenu from "../../components/OwnerMenu";
import toast from "react-hot-toast";
import { ListPlus } from "lucide-react";
import PlaylistModal from "../../components/playlists/PlaylistModal.jsx"

const WatchVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openPlaylistModal, setPlaylistModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response?._id || null);
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await watchVideo(id);
        setVideo(response?.data || null);
      } catch (err) {
        setError(err.message || "Failed to load video");
      }
    };

    fetchVideo();
  }, [id]);

  const refreshComments = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(video._id);
      toast.success("Video deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(" Delete failed:", err.message);
      toast.error("Failed to delete video");
    }
  };

  const handleEdit = () => {
    navigate(`/videos/${video._id}/update`);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!video) return <p className="text-gray-400">Loading video...</p>;

  const owner = video.ownerInfo || video.owner || {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-white">
      {/* Video Player */}
      <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full rounded-lg bg-black"
        />
      </div>

      {/* Title + OwnerMenu */}
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-bold">{video.title || "No title"}</h1>

        {String(currentUser) === String(owner?._id) && (
          <OwnerMenu onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {/* Channel Info + Like Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <img
            onClick={() => navigate(`/c/${owner.username}`)}
            src={owner.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          />
          <div>
            <p className="text-white font-semibold">
              {owner?.fullName || "Unknown"}
            </p>
            <p>
              {video.views || 0} views • {moment(video.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <VideoLike videoId={video._id} />

          <button
            onClick={() => setPlaylistModal(true)}
            className="px-4 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm font-medium text-white transition flex items-center gap-2"
          >
            <ListPlus size={18} />
            
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#1c1c1c] p-4 rounded-lg text-sm mb-6">
        {video.description || "No description available."}
      </div>

      {/* Add Comment */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
        <AddComment videoId={id} onCommentAdded={refreshComments} />
      </div>

      {/* All Comments */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg">
        <GetAllComments videoId={id} refreshFlag={refreshFlag} />
      </div>

       {openPlaylistModal && <PlaylistModal onClose={() => setPlaylistModal(false)} />}
    </div>
  );
};

export default WatchVideo;
