import React, { useEffect, useState } from "react";
import { toggleVideoLike, getVideoLikeStatus } from "../../services/LikeServices";
import { ThumbsUp } from "lucide-react";

const VideoLike = ({ videoId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch like status from backend
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await getVideoLikeStatus(videoId);
        // console.log("res.data: ",res.data); // res.data === true / false
        setIsLiked(res.data.isLiked); // directly set like status
       
      } catch (err) {
        console.error("❌ Error fetching like status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikeStatus();
  }, [videoId]);

  //  console.log("like status: ",isLiked);

  // ✅ Toggle like status
  const handleToggleLike = async () => {
    try {
      setLoading(true);
      await toggleVideoLike(videoId);
      setIsLiked((prev) => !prev); // locally invert after success
    } catch (err) {
      console.error("❌ Error toggling like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 ${
        isLiked ? "text-blue-500" : "text-gray-400 hover:text-blue-400"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <ThumbsUp
        size={18}
        className={`${
          isLiked
            ? "fill-blue-500 stroke-blue-500"
            : "stroke-gray-400 hover:stroke-blue-400"
        }`}
      />
      <span>{isLiked ? "Liked" : "Like"}</span>
    </button>
  );
};

export default VideoLike;
