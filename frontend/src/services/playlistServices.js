// src/services/playlistServices.js
import axios from "./axiosInstance";

// 1️⃣ Create a new playlist
export const createPlaylist = async (data) => {
  const res = await axios.post("/playlists/create", data);
  return res.data;
};

// 2️⃣ Get all playlists of the current user
export const getUserPlaylists = async () => {
  const res = await axios.get("/playlists/my-playlists");
  return res.data;
};

// 3️⃣ Get a specific playlist by ID
export const getPlaylistById = async (id) => {
  const res = await axios.get(`/playlists/${id}`);
  return res.data;
};

// 4️⃣ Update playlist details (title, description, etc.)
export const updatePlaylist = async (playlistId, data) => {
  const res = await axios.patch(`/playlists/${playlistId}/update`, data);
  return res.data;
};

// 5️⃣ Add a video to a playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  const res = await axios.patch(`/playlists/${playlistId}/add-video`, { videoId });
  return res.data;
};

// 6️⃣ Remove a video from a playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const res = await axios.patch(`/playlists/${playlistId}/remove-video`, { videoId });
  return res.data;
};

// 7️⃣ Delete a playlist
export const deletePlaylist = async (playlistId) => {
  const res = await axios.patch(`/playlists/${playlistId}/delete`);
  return res.data;
};
