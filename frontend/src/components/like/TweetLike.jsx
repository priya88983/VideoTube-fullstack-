import React, { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toggleTweetLike, getTweetLikeStatus } from '../../services/LikeServices';
import { getCurrentUser } from '../../services/authServices';

const TweetLike = ({ tweetId }) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);

        const res = await getTweetLikeStatus(tweetId);

        console.log("tweet Res: ",res);

        setIsLiked(res.data);
      } catch (err) {
        console.error(" Error fetching tweet like status:", err);
      }
    };

    fetchStatus();
  }, [tweetId]);

  console.log("tweet isliked : ",isLiked);

  const handleToggle = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      await toggleTweetLike(tweetId);
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error("Toggle tweet like failed:", err);
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

export default TweetLike;
