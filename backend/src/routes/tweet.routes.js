
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controller.js";

const router = Router();

// 🐦 Create a tweet (with optional image/video upload)
router.route("/create").post(
  verifyJWT,
  createTweet
);

// 👤 Get all tweets by current user
router.route("/user/:userId").get(verifyJWT, getUserTweets);

// ✏️ Update a tweet
router.route("/:id/update").patch(verifyJWT, updateTweet);

// 🗑️ Delete a tweet
router.route("/:id/delete").patch(verifyJWT, deleteTweet);

export default router;