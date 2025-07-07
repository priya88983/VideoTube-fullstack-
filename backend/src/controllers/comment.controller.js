import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//TODO: get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Invalid videoId");
  }

  const commentsAggregate = Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo"
      }
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        content: 1,
        createdAt: 1,
        ownerInfo: {
          _id: "$ownerInfo._id",
          username: "$ownerInfo.username",
          avatar: "$ownerInfo.avatar",
          fullName: "$ownerInfo.fullName"
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const comments = await Comment.aggregatePaginate(commentsAggregate, options);

  console.log("🔥 Final comments:", comments);

  return res
    .status(200)
    .json(new apiResponse(200, comments, "Comments fetched successfully"));
});



//TODO: add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  //  console.log("addComment controller hit!");
  
  const { content } = req.body;
  const {videoId }= req.params;
  

  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "You must be logged in to add comment");
  }

  if (!content || !videoId) {
    throw new apiError(400, "Content and videoId are required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Invalid videoId");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId
  });

  // console.log("comment sent from backend: ",comment)

  return res
    .status(201)
    .json(new apiResponse(201, comment, "Comment added successfully"));
});

//TODO: update a comment
const updateComment = asyncHandler(async (req, res) => {
  // console.log(req.params);
  const { commentId } = req.params;

  const { content } = req.body;

  console.log("comment id:" ,commentId)
  console.log("comment content: ",content)

  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "You must be logged in to update comment");
  }

  if (!content) {
    throw new apiError(400, "Content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Invalid commentId");
  }

 console.log(" Received commentId:", commentId, "| Length:", commentId.length);
console.log(" Char Codes:", commentId.split("").map(c => c.charCodeAt(0)));

const comment = await Comment.findOne({ _id: commentId.trim() });

if (!comment) {
  const all = await Comment.find({});
  console.log(" All comment IDs in DB:", all.map(c => c._id.toString()));
  throw new apiError(404, "Comment not found even after trimming");
}


  if (comment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to update this comment");
  }

  comment.content = content;
  await comment.save();

  // console.log("comment sent from backend: ",comment)

return res
.status(200)
.json(
  new apiResponse(200, {
    _id: comment._id,
    content: comment.content,
    video: comment.video.toString(), 
    owner: comment.owner,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  }, "Comment updated successfully")
)
});

//TODO: delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "You must be logged in to delete comment");
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new apiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Comment deleted successfully"));
});




export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
};
