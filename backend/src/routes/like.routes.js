import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {


  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getVideoLikeStatus,
  getCommentLikeStatus,
  getTweetLikeStatus
} from "../controllers/like.controller.js";

const router = Router();




router.route("/video/:videoId/toggle").patch(verifyJWT, toggleVideoLike);


router.route("/comment/:commentId/toggle").patch(verifyJWT, toggleCommentLike);


router.route("/tweet/:tweetId/toggle").patch(verifyJWT, toggleTweetLike);


router.route("/liked-videos").get(verifyJWT, getLikedVideos);

router.route("/video/like-status/:videoId").get(verifyJWT, getVideoLikeStatus);


router.route("/comment/like-status/:commentId").get(verifyJWT, getCommentLikeStatus);

router.route("/tweet/like-status/:tweetId").get(verifyJWT, getTweetLikeStatus);


export default router;
