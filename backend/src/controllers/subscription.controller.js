import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new apiError(400, "Invalid channel ID.");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "You must be logged in to toggle subscription.");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (!existingSubscription) {
    const subscribed = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    console.log("data sent from subscription controller: ",subscribed);
    return res
      .status(200)
      .json(new apiResponse(200, subscribed, "Channel Subscribed successfully."));
  } else {
   const unsubscribed = await existingSubscription.deleteOne();

    console.log("while unsubscribing:",unsubscribed)

    return res
      .status(200)
      .json(new apiResponse(200, null, "Channel unsubscribed successfully."));
  }

});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

  const { channelId } = req.params;

  // console.log("params :",req.params);
  

  if (!isValidObjectId(channelId)) {
    throw new apiError(400, "Invalid channel ID.");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberInfo",
      },
    },
    { $unwind: "$subscriberInfo" },
    {
      $project: {
        _id: 0,
        fullName: "$subscriberInfo.fullName",
        username: "$subscriberInfo.username",
        avatar: "$subscriberInfo.avatar",
      },
    },
  ]);

  if (subscribers.length === 0) {
    throw new apiError(404, "Subscribers not found.");
  }
  //  console.log("subscribers of channels: ",subscribers)

  return res
    .status(200)
    .json(new apiResponse(200, subscribers, "Subscribers fetched successfully."));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

//  console.log(" Channel ID received in controller:", channelId);

  // console.log("params:",req.params);
  if (!isValidObjectId(channelId)) {
    throw new apiError(400, "Invalid subscriber ID.");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannelInfo",
      },
    },
    { $unwind: "$subscribedChannelInfo" },
    {
      $project: {
        _id: 0,
        fullName: "$subscribedChannelInfo.fullName",
        username: "$subscribedChannelInfo.username",
        avatar: "$subscribedChannelInfo.avatar",
      },
    },
  ]);

 

  // console.log("subscribed channels: ",subscribedChannels)
  return res
    .status(200)
    .json(new apiResponse(200, subscribedChannels, "Subscribed channels fetched successfully."));
});

const getSubscriptionStatus =asyncHandler(async(req,res)=>{
  const { channelId } = req.params;
  const currentUser = req.user?._id;

   if (!currentUser) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  console.log("channelId:", channelId);
console.log("currentUser:", currentUser);

    const subscribe = await Subscription.findOne({ subscriber: currentUser, channel: channelId });

    const isSubscribed= !!subscribe;

     console.log("isSubscribed : ",isSubscribed);


  return res.status(200).json(
    new apiResponse(200, { isSubscribed}, "Subscribe status fetched successfully.")
  );


})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels,getSubscriptionStatus };
