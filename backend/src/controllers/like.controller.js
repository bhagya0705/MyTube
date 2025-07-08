import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    await Like.deleteOne({ video: videoId, likedBy: userId, type: "dislike" });

    const like = await Like.findOne({ video: videoId, likedBy: userId });
    if (like) {

        await Like.deleteOne({ video: videoId, likedBy: userId });

        const likeCount = await Like.countDocuments({ video: videoId, type: "like" });
        const dislikeCount = await Like.countDocuments({ video: videoId, type: "dislike" });

        return res.status(200).json(
            new ApiResponse(200, { likeCount,dislikeCount }, "Video like removed successfully")
        );
    } else {

        const newLike = await Like.create({
            video: videoId,
            likedBy: userId,
            type: "like"
        })

        const likeCount = await Like.countDocuments({ video: videoId, type: "like" });
        const dislikeCount = await Like.countDocuments({ video: videoId, type: "dislike" })

        return res.status(200).json(new ApiResponse(200, {newLike, likeCount,dislikeCount} ,"Video liked successfully"));
    }
});

const toggleVideoDisLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    await Like.deleteOne({ video: videoId, likedBy: userId, type: "like" });
    const dislike = await Like.findOne({ video: videoId, likedBy: userId , type: "dislike" });

    if (dislike) {

        await Like.deleteOne({ video: videoId, likedBy: userId , type: "dislike" });
        const likeCount = await Like.countDocuments({ video: videoId, type: "like" });
        const dislikeCount = await Like.countDocuments({ video: videoId, type: "dislike" })

        return res.status(200).json(
            new ApiResponse(200, { likeCount,dislikeCount }, "Video dislike removed successfully")
        );
    } else {

        const newDisLike = await Like.create({
            video: videoId,
            likedBy: userId,
            type: "dislike"
        })

        const likeCount = await Like.countDocuments({ video: videoId, type: "like" });
        const dislikeCount = await Like.countDocuments({ video: videoId, type: "dislike" })

        return res.status(200).json(new ApiResponse(200, {newDisLike, likeCount,dislikeCount} ,"Video disliked successfully"));
    }
});
export {toggleVideoLike,toggleVideoDisLike};