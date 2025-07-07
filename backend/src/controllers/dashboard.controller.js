import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total videos by this user
  const videos = await Video.find({ owner: userId });

  const totalVideos = videos.length;

  // Total views = sum of views of all videos
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

  // Total likes = sum of likes on all videos
  const videoIds = videos.map((v) => v._id);
  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds }
  });

  // Total subscribers (people who have subscribed to this user)
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId
  });

  const stats = {
    totalVideos,
    totalViews,
    totalLikes,
    totalSubscribers
  };

  return res.status(200).json(new apiResponse(200, stats, "Channel stats fetched successfully"));
});


const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new apiError(400, "Invalid channel ID.");
  }

  const channelVideos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(channelId) }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "channel"
      }
    },
    {
      $unwind: "$channel"
    },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        "channel.username": 1,
        "channel.avatar": 1
      }
    }
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, channelVideos, "Channel videos fetched successfully."));
});


export {
    getChannelStats, 
    getChannelVideos
    }