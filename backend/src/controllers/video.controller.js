import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import { PlayList } from "../models/playlist.models.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadonCloudinary } from "../utils/cloudinary.js"

//TODO publish video
// get the video file,title,description,duration,thumbnail from user
// upload video file to cloudinary
// create video document in database

const publishVideo = asyncHandler(async (req, res) => {
    const { title, duration, description } = req.body;
    if (!title || !duration || !description) {
        throw new ApiError(400, "Title, duration and description are required");
    }

    const videoFilePath = req.files?.videoFile[0].path;
    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }

    const thumbnailFilePath = req.files?.thumbnail[0].path;
    if (!thumbnailFilePath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const video = await uploadonCloudinary(videoFilePath);
    if (!video) {
        throw new ApiError(500, "Failed to upload video to cloudinary");
    }

    const thumbnail = await uploadonCloudinary(thumbnailFilePath);
    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
    }

    const ownerId = req.user._id;
    const owner = await User.findById(ownerId).select("username avatar");

    const newVideo = Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        views: 0,
        isPublished: true,
        owner
    })

    return res.status(200).json(
        new ApiResponse(200, newVideo, "Video uploaded successfully")
    );

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar fullName");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const likeCount = await Like.countDocuments({ video: videoId, type: "like" });
    const dislikeCount = await Like.countDocuments({ video: videoId, type: "dislike" });

    let isLiked = false;
    let isDisliked = false;

    if (req.user) {
        const userId = req.user._id;

        isLiked = await Like.exists({ video: videoId, likedBy: userId, type: "like" });
        isDisliked = await Like.exists({ video: videoId, likedBy: userId, type: "dislike" });
    }

    return res.status(200).json(
        new ApiResponse(200, {
            ...video._doc,
            likeCount,
            dislikeCount,
            isLiked,
            isDisliked
        }, "Video fetched successfully")
    );
});


const addToWatchHistory = asyncHandler(async(req,res) =>{
     const video = await Video.findById(req.params.videoId);
     await User.findByIdAndUpdate(req.user._id, {
     $addToSet: { watchHistory: video._id },
   });
})

const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc", userId, query } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {
        isPublished: true,
    };

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    const sortOrder = sortType === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("owner","fullName username avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const { title, description } = req.body;
    if (!title && !description) {
        throw new ApiError(400, "Title or description is required to update video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

     await PlayList.updateMany(
    { videos: videoId },
    { $pull: { videos: videoId } }
  );

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
})

const removeFromWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $pull: { watchHistory: videoId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video removed from watch history"));
});

// controllers/video.controller.js
const incrementVideoView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } }, // increment by 1
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video view incremented"));
});


const getUserVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const count = await Video.countDocuments({owner:userId});
    return res.status(200).json(
        new ApiResponse(200,count,"User Videos count")
    )
})

export { publishVideo, getVideoById, updateVideo, deleteVideo, getAllVideos, addToWatchHistory, removeFromWatchHistory, getUserVideos, incrementVideoView };