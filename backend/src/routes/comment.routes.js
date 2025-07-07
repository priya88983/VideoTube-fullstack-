import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

//  Get all comments on a video
router.route("/video/:videoId").get(getVideoComments);

//  Add a new comment to a video
router.route("/video/:videoId/add-comment").post(verifyJWT, addComment);

//  Update a specific comment
router.route("/:commentId/update").patch(verifyJWT, updateComment);

// delete a comment (or all user comments on a video, depending on controller logic)
router.route("/:commentId/delete").patch(verifyJWT, deleteComment);

export default router;
