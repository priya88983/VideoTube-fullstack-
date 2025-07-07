import React, { useEffect, useState } from 'react';
import { toggleCommentLike, getCommentLikeStatus } from '../../services/LikeServices';
import { getCurrentUser } from '../../services/authServices';
import { ThumbsUp } from 'lucide-react';

const CommentLike = ({ commentId }) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUserAndLikeStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const res = await getCommentLikeStatus(commentId);
        setIsLiked(res.data);
      } catch (err) {
        console.error("❌ Error fetching like status:", err);
      }
    };

    fetchUserAndLikeStatus();
  }, [commentId]);

  // ✅ Toggle like
  const handleToggle = async () => {
    if (loading || !user) return;
    setLoading(true);
    try {
      await toggleCommentLike(commentId);
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error("❌ Toggle like failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 
        ${isLiked ? "text-blue-500" : "text-gray-400 hover:text-blue-400"} 
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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

export default CommentLike;
