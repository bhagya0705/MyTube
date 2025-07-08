import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"

const getVideoComments = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const comments = await Comment.find({video:videoId}).populate("owner","fullName avatar username").sort({createdAt:-1});

    return res.status(200).json(
        new ApiResponse(200,comments,"Comments fetched successfully")
    )
});

const addComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const {content} = req.body;
    const userId = req.user._id;

    console.log("videoId:", videoId);
    console.log("userId:", req.user);
    console.log("content:", content);

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const comment = await Comment.create({
        content,
        video:videoId,
        owner:userId
    })

    await comment.populate("owner","fullName avatar username");

     return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  
  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});


export {getVideoComments,addComment, deleteComment};