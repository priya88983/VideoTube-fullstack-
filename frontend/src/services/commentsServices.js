import axiosInstance from "./axiosInstance"; // ✅ You're using a custom instance, good!

//  Add a comment to a video  
export const addComment = async (videoId, data) => {
  const res = await axiosInstance.post(`/comments/video/${videoId}/add-comment`, data);
  return res.data;
};

// Update a comment
export const updateComment = async (commentId, data) => {
  const res = await axiosInstance.patch(`/comments/${commentId}/update`, data);
  return res.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const res = await axiosInstance.patch(`/comments/${commentId}/delete`);
  return res.data;
};

//  Get all comments for a video
export const getAllComments = async (videoId) => {
  const res = await axiosInstance.get(`/comments/video/${videoId}`);
  return res.data;
};
