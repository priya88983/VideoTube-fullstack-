import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import { use, useId } from "react"



const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    //checking if user is logged in 

      const user = req.user;
    
    if (!user?._id) {
      throw new apiError(401, "You must be logged in to like a video");
    }
    
     //  Check if video exists

      const existingVideo = await Video.findById(videoId);
      if (!existingVideo) {
        throw new apiError(404, "Video not found.");
      }

     //checking if like exists or not

     const existingLike = await Like.findOne({

         video: videoId,
        likedBy: user._id

     })

     if(existingLike){
      const  unliked= await existingLike.deleteOne()
        
        //sending response 
console.log("unliked successfully:",unliked);

        return res
        .status(200)
        .json(new apiResponse(200,
            null,
            "Video unliked successfully.")

            
        );
     }

     else

     {
        
    const like = await Like.create({
      video: videoId,
      likedBy: user._id

    });

    console.log("liked: ",like)
    return res
    .status(200)
    .json(
      new apiResponse(200,
        like,
        "Video liked successfully.")
    )};

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment


      const user = req.user;
    
    if (!user?._id) {
      throw new apiError(401, "You must be logged in to like a comment");
    }
    
     //  Check if video exists
      const existingComment= await Comment.findById(commentId);
      if (!existingComment) {
        throw new apiError(404, "Comment not found.");
        
      }


      
     const existingLike = await Like.findOne({

         comment: commentId,
        likedBy: user._id

     })

     if(existingLike){
     const unliked=  await existingLike.deleteOne()
        
        //sending response 

         console.log("unliked successfully:",unliked);
        return res
        .status(200)
        .json(  new apiResponse(200,
            null,
            "Comment unliked successfully.")
     )
     }

     else

     {
        
    const like = await Like.create({
      comment: commentId,
      likedBy: user._id

    });

     console.log("liked: ",like)
    return res
    .status(200)
    .json(
        new apiResponse
       ( 200,
        like,
        "Comment liked successfully.")
    )};

     

});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet


      const user = req.user;
    
    if (!user?._id) {
      throw new apiError(401, "You must be logged in to like a tweet");
    }

    
     //  Check if tweet exists
      const existingTweet = await Tweet.findById(tweetId);
      if (!existingTweet) {
        throw new apiError(404, "tweet not found.");
      }


        
     const existingLike = await Like.findOne({

         tweet: tweetId,
        likedBy: user._id

     })

     if(existingLike){
       const unliked= await existingLike.deleteOne()
        
        //sending response 
        console.log("unliked successfully:",unliked);

        return res
        .status(200)
        .json(new apiResponse(200,
            null,
            "Tweet unliked successfully.")
        );
     }

     else

     {
        
    const like = await Like.create({
      tweet: tweetId,
      likedBy: user._id

    });
     console.log("liked: ",like)

    return res
    .status(200)
    .json(
      new apiResponse(200,
        like,
        "Tweet liked successfully.")
    )};
             

});

const getLikedVideos = asyncHandler(async (req, res) => {
  console.log("get liked controller hit!");

  const userId = req.user?._id;
  console.log("userId: ", userId);

  if (!userId) {
    throw new apiError(401, "You must be logged in to view liked videos.");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true }
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoData",
        pipeline: [
          {
            $project: {
              title: 1,
              description: 1,
              createdAt: 1,
              thumbnail: 1,
              owner: 1
            }
          }
        ]
      }
    },
    { $unwind: "$videoData" },

    // 👇 Add this lookup for fetching owner info
    {
      $lookup: {
        from: "users",
        localField: "videoData.owner",
        foreignField: "_id",
        as: "ownerInfo",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    { $unwind: "$ownerInfo" },

   
    {
      $addFields: {
        "videoData.ownerInfo": "$ownerInfo"
      }
    },

    {
      $replaceRoot: {
        newRoot: "$videoData"
      }
    }
  ]);

  // console.log("liked videos: ", likedVideos);

  return res.status(200).json(
    new apiResponse(
      200,
      likedVideos,
      "Liked videos fetched successfully."
    )
  );
});

const getVideoLikeStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log("params: ", req.params);

  const currentUser = req.user?._id;

  if (!currentUser) {
    return res.status(401).json(new apiResponse(401, null, "Unauthorized user."));
  }

  const like = await Like.findOne({ video: videoId, likedBy: currentUser });

  const isLiked = !!like;

  // console.log("isliked : ",isLiked);


  return res.status(200).json(
    new apiResponse(200, { isLiked }, "Like status fetched successfully.")
  );
});

const getCommentLikeStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const currentUser = req.user?._id;

  if (!currentUser) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  const like = await Like.findOne({ comment: commentId, likedBy: currentUser });

  const isLiked = !!like;
    // console.log("liked status in backend: ",isLiked);

  res.status(200).json(
    new apiResponse(200, isLiked, "Comment like status fetched successfully.")
  );
});

const getTweetLikeStatus = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const currentUser = req.user?._id;

  if (!currentUser) {
    return res.status(401).json({ success: false, message: "Unauthorized user." });
  }

  const like = await Like.findOne({ tweet: tweetId, likedBy: currentUser });

  const isLiked = !!like;
  // console.log("liked status in backend: ",isLiked);

  res.status(200).json(
    new apiResponse(200, isLiked, "Tweet like status fetched successfully.")
  );
});



export {
 
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getVideoLikeStatus,
    getCommentLikeStatus,
    getTweetLikeStatus
}