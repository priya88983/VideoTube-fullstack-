import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getAllVideos,
  publishAVideo,
  watchVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getVideosByUser
} from "../controllers/video.controller.js";

const router = Router();


router.route("/all-videos").get(getAllVideos);
router.route("/:id/watch").patch(verifyJWT,watchVideo); 
router.route("/:id").get(getVideoById);   
router.route("/:userId/getVideos").get(getVideosByUser)    


router.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);

router.route("/:id/update").patch(
  verifyJWT,
  upload.single("thumbnail"),
  updateVideo
);

router.route("/:id/delete").patch(
  verifyJWT,
  deleteVideo
);

router.route("/:id/toggle").patch(
  verifyJWT,
  togglePublishStatus
);


export default router;
