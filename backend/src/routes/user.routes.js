import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { changePassword } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { getUserChannelProfile } from "../controllers/user.controller.js";
import { updateAccountDetails } from "../controllers/user.controller.js";
import { updateAvatar } from "../controllers/user.controller.js";
import { updateCoverImage } from "../controllers/user.controller.js";
import { getWatchHistory } from "../controllers/user.controller.js";
import { getUserVideos, incrementVideoView, publishVideo, removeFromWatchHistory } from "../controllers/video.controller.js";
import {getVideoById} from "../controllers/video.controller.js";
import { updateVideo } from "../controllers/video.controller.js";
import { deleteVideo } from "../controllers/video.controller.js";
import { getAllVideos } from "../controllers/video.controller.js";
import { addToWatchHistory } from "../controllers/video.controller.js";
import { toggleVideoLike } from "../controllers/like.controller.js";
import { toggleVideoDisLike } from "../controllers/like.controller.js";
import { deleteComment, getVideoComments } from "../controllers/comment.controller.js";
import { addComment } from "../controllers/comment.controller.js";
import { getSubscribedChannels, getUserChannelSubscribers, subscribeToChannel, unsubscribeToChannel } from "../controllers/subscription.controller.js";
import { createPlaylist, getUserPlaylist, addVideoToPlaylist, deletePlaylist } from "../controllers/playlist.controller.js";
import { summarizeVideo } from "../controllers/summarize.controller.js";

const router = Router();
router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
    
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/channel/:username").get(getUserChannelProfile); 
router.route("/watch-history").get(verifyJWT,getWatchHistory);
router.route("/watch-history/remove/:videoId").post(verifyJWT,removeFromWatchHistory)
router.route("/publish").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishVideo);
router.route("/video/:videoId").get(getVideoById);
router.route("/addVideo/:videoId").post(verifyJWT,addToWatchHistory)
router.route("/video/:videoId").patch(verifyJWT, updateVideo);
router.route("/video/:videoId").delete(verifyJWT, deleteVideo);
router.route("/videos").get(getAllVideos);
router.route("/video/:videoId/like").post(verifyJWT, toggleVideoLike);
router.route("/video/:videoId/dislike").post(verifyJWT, toggleVideoDisLike);
router.route("/video/:videoId/comments").get(getVideoComments);
router.route("/video/:videoId/comments").post(verifyJWT,addComment);
router.route("/video/:videoId/views").patch(verifyJWT,incrementVideoView);
router.route("/video/:commentId/comments").delete(verifyJWT,deleteComment)
router.route("/user-videos").get(verifyJWT,getUserVideos)
router.route("/subscribe/:channelId").post(verifyJWT,subscribeToChannel)
router.route("/unsubscribe/:channelId").post(verifyJWT,unsubscribeToChannel)
router.route("/subscriptions").get(verifyJWT,getSubscribedChannels)
router.route("/subscribers/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/create-playlist").post(verifyJWT,upload.fields([
    {
        name:"videos",
        maxCount:10
    }
]),createPlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/playlists/:userId").get(getUserPlaylist)
router.route("/add-to-playlist/:playlistId").post(verifyJWT,addVideoToPlaylist)
router.route("/summarize").post(summarizeVideo);
export default router;