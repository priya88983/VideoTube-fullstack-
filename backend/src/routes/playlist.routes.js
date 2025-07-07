import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist} from "../controllers/playlist.controller.js"


const router = Router();

//  Create a new playlist
router.route("/create").post(verifyJWT, createPlaylist);

//  Get all playlists of current user
router.route("/my-playlists").get(verifyJWT, getUserPlaylists);

// Get a specific playlist by ID
router.route("/:id").get(verifyJWT, getPlaylistById);

//  Update playlist details (title, description, thumbnail, etc.)
router.route("/:id/update").patch(verifyJWT, updatePlaylist);

//  Add a video to playlist
router.route("/:id/add-video").patch(verifyJWT, addVideoToPlaylist);

// Remove a video from playlist
router.route("/:id/remove-video").patch(verifyJWT, removeVideoFromPlaylist);

//  Delete a playlist
router.route("/:id/delete").patch(verifyJWT, deletePlaylist);

export default router;
