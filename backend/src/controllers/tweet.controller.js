import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareSync } from "bcrypt";

const createTweet = asyncHandler(async (req, res) => {

  const contents = req.body;
  // console.log("content: ",contents);

  console.log(req.file)

  const { content } = req.body;

  if (!content) {
    throw new apiError(400, "This field is required. ");
  }

  const user = req.user?._id;
  if (!user) {
    throw new apiError(401, "you must be logged in to add a tweet.");
  }

  const tweet = await Tweet.create({
    content,
    owner: user,
  });
  // console.log("tweet sent: ",tweet);

  return res
    .status(201)
    .json(new apiResponse(201, tweet, "Your tweet added successfully."));
});

const getUserTweets = asyncHandler(async (req, res) => {

  // console.log("tweet controller got hit")

  const { userId } = req.params;
  
  // console.log("params :",req.params);

  if (!userId) {
    throw new apiError(400, "User ID is required.");
  }

  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: "$ownerInfo",
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        "ownerInfo._id":1,
        "ownerInfo.fullName": 1,
        "ownerInfo.username": 1,
        "ownerInfo.avatar": 1,
      },
    },
  ]);

  

  // console.log("tweets are: ",userTweets);

  return res.status(200).json(
    new apiResponse(200, userTweets, "User tweets fetched successfully.")
  );
});


const updateTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  console.log("params: ", id);
  console.log("body : ", req.body);

  if (!content) {
    throw new apiError(400, "Content is required");
  }

  if (!isValidObjectId(id)) {
    throw new apiError(400, "Invalid tweet ID.");
  }

  const existingTweet = await Tweet.findById(id);
  if (!existingTweet) {
    throw new apiError(404, "Tweet does not exist.");
  }

  const user = req.user?._id;
  if (!user) {
    throw new apiError(401, "You must be logged in to update the tweet.");
  }

  if (existingTweet.owner.toString() !== user.toString()) {
    throw new apiError(403, "You are not allowed to update this tweet.");
  }

  existingTweet.content = content;
  await existingTweet.save();


  await existingTweet.populate("owner", "_id fullName username avatar");

  console.log("tweet : ",existingTweet);

  return res
    .status(200)
    .json(new apiResponse(200, existingTweet, "Tweet updated successfully."));
});


const deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;

  if (!isValidObjectId(tweetId)) {
    throw new apiError(400, "Invalid tweet ID.");
  }

  const existingTweet = await Tweet.findById(tweetId);
  if (!existingTweet) {
    throw new apiError(404, "tweet does not exist. ");
  }

  const user = req.user?._id;
  if (!user) {
    throw new apiError(401, "you must be logged in to delete the tweet. ");
  }

  if (existingTweet.owner.toString() != user.toString()) {
    throw new apiError(403, "You are not allowed to delete this tweet.");
  }

  await existingTweet.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
