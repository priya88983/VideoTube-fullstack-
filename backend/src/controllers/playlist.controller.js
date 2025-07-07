import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {

  const { name, description } = req.body;

  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "You must be logged in to create playlist.");
  }

  if (!name || !description) {
    throw new apiError(400, "All fields are required.");
  }

  // Create playlist (with or without video)
  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });

  if (!playlist) {
    throw new apiError(500, "Something went wrong while creating playlist");
  }

  console.log("playlist resonse sent : ",playlist);

  return res
    .status(201)
    .json(new apiResponse(201, playlist, "Playlist created successfully."));
});


const getUserPlaylists = asyncHandler(async (req, res) => {

  const userId = req.user?._id

  // console.log(req.user);

  // TODO: get user playlists

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new apiError(400, "Invalid user ID.");
  }

  const userPlaylists = await Playlist.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 }, // latest first (optional)
    },
  ]);
  console.log("user playlists: ",userPlaylists);

if (!userPlaylists || userPlaylists.length === 0) {
  throw new apiError(404, "No playlists found for this user.");
}


  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        userPlaylists,
        "User playlists fetched successfully."
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {

  
   const  playlistId  = req.params.id

  // console.log("playlistid: ",playlistId)

  if (playlistId && !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new apiError(400, "Invalid playlist ID.");
  }
const playlist = await Playlist.findById(playlistId)
  .populate({
    path: "videos",
    populate: {
      path: "owner", // nested populate
      select: "fullName username avatar", // only pick required fields
    },
  })
  .populate("owner", "fullName username avatar"); // playlist's owner


  if (!playlist) {
    throw new apiError(404, "Playlist not found.");
  }
  // console.log("playlist by id: ",playlist);

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {

  const playlistId = req.params.id;;
  
  const userId = req.user?._id;
   const videoId = req.body.videoId;
console.log("playlist id: ",playlistId)
  
console.log("videoid: ",videoId);
  // Check if user is logged in
  if (!userId) {
    throw new apiError(401, "You must be logged in to modify playlists.");
  }

  // Validate playlistId
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }

  // Validate videoId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }

  // Check if video exists
  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new apiError(404, "Video not found.");
  }

  // Check if playlist exists
  const existingPlaylist = await Playlist.findById(playlistId);
  if (!existingPlaylist) {
    throw new apiError(404, "Playlist not found.");
  }

  // Check if the logged-in user is the owner of the playlist
  if (existingPlaylist.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to modify this playlist.");
  }

  // Check if video already in playlist
  if (existingPlaylist.videos.includes(videoId)) {
    throw new apiError(409, "Video already exist in the playlist.");
  }

  // Add video to playlist
  existingPlaylist.videos.push(videoId);
  await existingPlaylist.save();

  console.log("video added to playlist: ",existingPlaylist);

  return res
    .status(200)
    .json(
      new apiResponse(200, existingPlaylist, "Video added to playlist successfully.")
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
 
  // TODO: remove video from playlist

    const playlistId = req.params.id;;
  
 
   const videoId = req.body.videoId;
console.log("playlist id: ",playlistId)
  
console.log("videoid: ",videoId);
  const userId = req.user?._id;

  // Check if user is logged in
  if (!userId) {
    throw new apiError(401, "You must be logged in to modify playlists.");
  }

  // Validate playlistId
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }

  // Validate videoId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }

  // Check if video exists
  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new apiError(404, "Video not found.");
  }

  // Check if playlist exists
  const existingPlaylist = await Playlist.findById(playlistId);
  if (!existingPlaylist) {
    throw new apiError(404, "Playlist not found.");
  }

  // Check if the logged-in user is the owner of the playlist
  if (existingPlaylist.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to modify this playlist.");
  }

  // Check if video  is present in playlist
  if (!existingPlaylist.videos.includes(videoId)) {
    throw new apiError(404, "Video does not exist in the playlist.");
  }

 const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

   return res.status(200).json(
    new apiResponse(200, updatedPlaylist, "Video removed from playlist successfully.")
  );
});


const deletePlaylist = asyncHandler(async (req, res) => {
 
  // TODO: delete playlist
 
  const playlistId  = req.params.id;

 
console.log(playlistId)
  // Check if user is logged in
    
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(401, "You must be logged in to modify playlists.");
  }

  // Validate playlistId
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }


  // Check if playlist exists
  const existingPlaylist = await Playlist.findById(playlistId);
  if (!existingPlaylist) {
    throw new apiError(404, "Playlist not found.");
  }

  // Check if the logged-in user is the owner of the playlist
  if (existingPlaylist.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to modify this playlist.");
  }

 await existingPlaylist.deleteOne();


  return res
  .status(200)
  .json(
    new apiResponse(
        200,
        null,
        "Playlist deleted successfully"
    )
  )

});

const updatePlaylist = asyncHandler(async (req, res) => {
  const playlistId  = req.params.id;
  const { name, description } = req.body;
  console.log(req.params);

  // Validate fields
  if (!name && !description) {
    throw new apiError(400, "At least one field (name or description) is required.");
  }


  // Check if user is logged in
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(401, "You must be logged in to modify playlists.");
  }

  // Validate playlistId
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }

  // Check if playlist exists
  const existingPlaylist = await Playlist.findById(playlistId);
  if (!existingPlaylist) {
    throw new apiError(404, "Playlist not found.");
  }

  // Ownership check
  if (existingPlaylist.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to modify this playlist.");
  }

  // Update fields if provided
  if (name) existingPlaylist.name = name;
  if (description) existingPlaylist.description = description;

  await existingPlaylist.save();

  console.log("updated playlist: ",existingPlaylist)

  return res
    .status(200)
    .json(
      new apiResponse(200, existingPlaylist, "Playlist updated successfully.")
    );
});


export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
};
