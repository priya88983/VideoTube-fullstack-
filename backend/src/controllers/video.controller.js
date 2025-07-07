import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, query, sortBy, sortType } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const matchStage = query
    ? { description: { $regex: query, $options: "i" } }
    : {};

  const videos = await Video.aggregate([
    { $match: matchStage },
    {
      $sort: {
        [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1,
      },
    },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $addFields: {
        ownerInfo: { $arrayElemAt: ["$ownerInfo", 0] },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerInfo: {
          _id: "$ownerInfo._id",
          fullName: "$ownerInfo.fullName",
          avatar: "$ownerInfo.avatar",
          subscriberCount: {
            $cond: {
              if: { $isArray: "$ownerInfo.subscribers" },
              then: { $size: "$ownerInfo.subscribers" },
              else: 0,
            },
          },
        },
      },
    },
  ]);

  if (!videos) {
    throw new apiError(401, "Something went wrong while fetching videos.");
  }

  const cleanedVideos = videos.filter(
    (v) =>
      v._id &&
      v.thumbnail &&
      v.title &&
      v.ownerInfo &&
      v.ownerInfo.fullName // ensure ownerInfo exists and is valid
  );

  // console.log("Sending cleaned videos to frontend:\n", JSON.stringify(cleanedVideos, null, 2));

  return res
    .status(200)
    .json(new apiResponse(200, cleanedVideos, "Videos fetched successfully"));
});


const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((fields) => fields?.trim() === "")) {
    throw new apiError(400, "ALl fields are compulsory required");
  }
console.log("title and description: ",title,description);

  const user = req.user;
  if (!user?._id) {
    throw new apiError(401, "You must be logged in to upload a video");
  }
  

  const videoToBeUploadedLocalPath = req.files?.video[0]?.path;
  if (!videoToBeUploadedLocalPath) {
    throw new apiError(400, "Video is required");
  }

  const video = await uploadOnCloudinary(videoToBeUploadedLocalPath);
  if (!video) {
    throw new apiError(400, "Video is required");
  }

  const duration = video.duration;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new apiError("thumbnail is required.");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new apiError("thumbnail is required.");
  }

  const videos = await Video.create({
    title,
    description,
    videoFile: video.url,
    duration,
    thumbnail: thumbnail.url,
    owner: user._id,
  });

  //for views


  const publishedVideo = await Video.findById(videos._id);
  
// console.log("published video in backend:" ,publishedVideo)

  return res.status(201).json(new apiResponse(200, publishedVideo, "video published successfully"));
});

const getVideosByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("Requested user ID:", userId);

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: { createdAt: -1 }, // optional: newest videos first
    },
    {
      $lookup: {
        from: "users", // 👈 your User collection name in MongoDB
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: "$ownerInfo", // 👈 to convert ownerInfo array to object
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        createdAt: 1,
        "ownerInfo._id": 1,
        "ownerInfo.username": 1,
        "ownerInfo.fullName": 1,
        "ownerInfo.avatar": 1,
      },
    },
  ]);

  console.log("videos fetched by user: ",videos);

  res.status(200).json({
    success: true,
    message: "User's videos fetched successfully.",
    data: videos,
  });
});


const watchVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const userId = user?._id;

  console.log("🔥🔥 watchVideo controller HIT");
  // console.log("Video ID:", id);
  // console.log("User ID:", userId);
  // console.log("user: ",user);

  if (!isValidObjectId(id)) {
    throw new apiError(400, "Invalid video ID");
  }

  // ✅ Step 1: Increment views
  const video = await Video.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username avatar fullName");

  if (!video) {
    throw new apiError(404, "Video not found");
  }


  if (userId) {
    try {
   
      await User.findByIdAndUpdate(userId, {
        $pull: { watchHistory: video._id }
      });

 
      await User.findByIdAndUpdate(userId, {
        $push: { watchHistory: video._id }
      });

      // ✅ Optional: Use $each + $slice to limit to 50 items
      // $push: { watchHistory: { $each: [video._id], $position: 0, $slice: 50 } }
    } catch (err) {
      console.error("❌ Failed to update watch history:", err.message);
    }
  }

  return res.status(200).json(
    new apiResponse(200, video, "Video fetched successfully")
  );
});



const getVideoById = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  console.log("videoID:", id);

  if (!isValidObjectId(id)) {
    throw new apiError(400, "Invalid video ID.");
  }

  // ✅ Populate owner's fullName and avatar
  const video = await Video.findById(id).populate("owner", "fullName avatar");
  
  console.log("video",video)

  if (!video) {
    throw new apiError(404, "Video not found.");
  }

  return res.status(200).json(new apiResponse(200, video, "Video fetched successfully."));
});



const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const user = req.user;

  if (!isValidObjectId(id)) {
    throw new apiError(400, "Invalid video ID.");
  }

  if (!title || !description) {
    throw new apiError(400, "Title and description are required.");
  }

  if (!user?._id) {
    throw new apiError(401, "You must be logged in to update a video.");
  }

  const existingVideo = await Video.findById(id);
  if (!existingVideo) {
    throw new apiError(404, "Video not found.");
  }

  if (existingVideo.owner.toString() !== user._id.toString()) {
    throw new apiError(403, "You are not allowed to update this video.");
  }

  let updatedThumbnailURL = existingVideo.thumbnail;
  console.log("existing thumbnail : ",updatedThumbnailURL)

  const thumbnailFile = req.file;

  console.log("Received file: ", req.file);

  if (thumbnailFile?.path) {
    //  Upload new thumbnail
    const uploaded = await uploadOnCloudinary(thumbnailFile.path);
    console.log("📤 Uploaded thumbnail:", uploaded);


    if (uploaded?.url) {
      //  Delete old thumbnail from Cloudinary
      if (existingVideo.thumbnail) {
        const publicId = existingVideo.thumbnail
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

          console.log("🧩 Extracted publicId:", publicId);


        try {
          await deleteFromCloudinary(publicId);
          console.log(" Old thumbnail deleted from Cloudinary");
        } catch (err) {
          console.warn("⚠ Error deleting old thumbnail:", err.message);
        }
      }

      updatedThumbnailURL = uploaded.url;

      console.log("🆕 Updated thumbnail URL:", updatedThumbnailURL);

    }
  }

  //  Update video
  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        thumbnail: updatedThumbnailURL,
      },
    },
    { new: true }
  );

  console.log("updated video: ",updatedVideo);
  return res
    .status(200)
    .json(new apiResponse(200, updatedVideo, "Video updated successfully"));
});




const deleteVideo = asyncHandler(async (req, res) => {

  console.log(req.params);
  const videoId= req.params.id;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID.");
  }

  const user = req.user;
  if (!user?._id) {
    throw new apiError(401, "You must be logged in to delete a video.");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new apiError(404, "Video not found.");
  }

  if (existingVideo.owner.toString() !== user._id.toString()) {
    throw new apiError(403, "You are not allowed to delete this video.");
  }

  // ✅ Delete video file from Cloudinary
  if (existingVideo.videoFilePublicId) {
    await deleteFromCloudinary(existingVideo.videoFilePublicId, "video");
  }

  // ✅ Delete thumbnail image from Cloudinary
  if (existingVideo.thumbnailPublicId) {
    await deleteFromCloudinary(existingVideo.thumbnailPublicId, "image");
  }

  // ✅ Delete video from DB
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new apiResponse(200, null, "Video deleted successfully."));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID.");
  }

  const user = req.user;
  if (!user?._id) {
    throw new apiError(401, "You must be logged in to upload a video");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new apiError(404, "Video not found.");
  }

  if (existingVideo.owner.toString() !== user._id.toString()) {
    throw new apiError(403, "You are not allowed to delete this video.");
  }

  existingVideo.isPublished = !existingVideo.isPublished;
  await existingVideo.save();

  return res.status(200).json(new apiResponse(200, existingVideo, "Video togglePublished successfully ."));
});

export {
  getAllVideos,
  publishAVideo,
  watchVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getVideosByUser
};