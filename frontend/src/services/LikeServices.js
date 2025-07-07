import axios from "./axiosInstance.js";

// Toggle like on a video
export const toggleVideoLike = async (videoId) => {
  const res = await axios.patch(`/likes/video/${videoId}/toggle`);
  return res.data;
};

// Toggle like on a comment
export const toggleCommentLike = async (commentId) => {
  const res = await axios.patch(`/likes/comment/${commentId}/toggle`);
  return res.data;
};

// 3 Toggle like on a tweet
export const toggleTweetLike = async (tweetId) => {
  const res = await axios.patch(`/likes/tweet/${tweetId}/toggle`);
  return res.data;
};


//  Get all liked videos of current user
export const getLikedVideos = async () => {
  const res = await axios.get(`/likes/liked-videos`);
  return res.data;
};

//  Get like status for a video
export const getVideoLikeStatus = async (videoId) => {
  const res = await axios.get(`/likes/video/like-status/${videoId}`);
  return res.data;
};


//  Get like status for a comment
export const getCommentLikeStatus = async (commentId) => {
  const res = await axios.get(`/likes/comment/like-status/${commentId}`);
  return res.data; // { success, message, data: true/false }
};

// 8️⃣ Get like status for a tweet
export const getTweetLikeStatus = async (tweetId) => {
  const res = await axios.get(`/likes/tweet/like-status/${tweetId}`);
  return res.data; // { success, message, data: true/false }
};
