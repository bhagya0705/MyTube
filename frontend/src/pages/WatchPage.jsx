import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getVideoById,
  toggleLike,
  toggleDisLike,
  getComments,
  postComment,
  deleteComment,
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscribedChannels,
  getChannelSubscribers,
  summarizeVideo,
  addToWatchHistory,
  incrementView
} from "../api/auth";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const WatchPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [disliked, setDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [summary,setSummary] = useState("")

  const fetchVideo = async () => {
    try {
      const res = await getVideoById(id);
      console.log(res);
      const videoData = res.data.data;
      setVideo(videoData);
      setLikeCount(videoData?.likeCount || 0);
      setLiked(videoData?.isLiked || false);

      addToWatchHistory(id);

      // generateSummary(videoData.videoFile);

      // ✅ Check subscription after loading video
      if (user) {
        const subRes = await getSubscribedChannels();
        const subscribedIds = subRes.data.data.map((sub) => sub.channel);
        if (subscribedIds.includes(videoData.owner._id)) {
          setSubscribed(true);
        } else {
          setSubscribed(false);
        }

        const res= await getChannelSubscribers(videoData.owner._id);
        setSubscriberCount(res.data.data.subscriberCount);
      }
    } catch (err) {
      console.error("Failed to load video", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      setComments(res.data.data);
    } catch (err) {
      console.error("Error loading comments", err);
    }
  };

  const handleViewIncrease = async () => {
  try {
    await incrementView(id);
  } catch (error) {
    console.error("Failed to increase views", error);
  }
};

   const generateSummary =async (videoUrl)=>{
    try{
      const res = await summarizeVideo(videoUrl);
      setSummary(res.data.summary)
    }catch(err){
      console.error("Error fetching summary", err);
    }
  }


  useEffect(() => {
    fetchVideo();
    fetchComments();
    handleViewIncrease(); 
  }, [id]);


  const handleLike = async () => {
    try {
      const res = await toggleLike(id);
      setLiked((prev) => !prev);
      setLikeCount(res.data.data.likeCount);
      setDislikeCount(res.data.data.dislikeCount);
      setDisliked(false);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await toggleDisLike(id);
      setDisliked((prev) => !prev);
      setLikeCount(res.data.data.likeCount);
      setDislikeCount(res.data.data.dislikeCount);
      setLiked(false);
    } catch (err) {
      console.error("Failed to toggle dislike", err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await postComment(id, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleSubscription = async () => {
    try {
      if (subscribed) {
        await unsubscribeFromChannel(video.owner._id);
        setSubscribed(false);
      } else {
        await subscribeToChannel(video.owner._id);
        setSubscribed(true); 
      }

      const res = await getChannelSubscribers(video.owner._id);
      setSubscriberCount(res.data.data.subscriberCount);

      // Optional: refresh full list to stay in sync with server
      // await fetchSubscriptionStatus();
    } catch (err) {
      console.error("Failed to toggle subscription", err);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!video) return <div className="text-red-500 p-8">Video not found.</div>;

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-b from-[#0f0f1b] to-[#15151e] text-white">
      <div className="w-full max-w-4xl mx-auto aspect-video mb-6">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full rounded-lg object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-400 mb-4">{video.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={video.owner.avatar}
            alt="Uploader"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{video.owner.fullName}</p>
            <p className="text-xs text-gray-400">
              {subscriberCount}{" "}
              {subscriberCount === 1 ? "subscriber" : "subscribers"}
            </p>
          </div>

          {user && user._id !== video.owner._id && (
            <button
              onClick={handleSubscription}
              className={`ml-auto ${
                subscribed ? "bg-gray-600" : "bg-blue-600"
              } hover:opacity-90 px-4 py-2 rounded text-sm font-medium`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/* Like / Dislike Section */}
        <div className="flex items-center space-x-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full text-gray-300 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 hover:text-white ${
              liked ? "text-blue-500" : ""
            }`}
          >
            <ThumbsUp size={18} />
            <span>
              {likeCount >= 1000
                ? (likeCount / 1000).toFixed(1) + "K"
                : likeCount}
            </span>
          </button>

          <span className="text-gray-600">|</span>

          <button
            onClick={handleDislike}
            className={`flex items-center space-x-1 hover:text-white ${
              disliked ? "text-red-500" : ""
            }`}
          >
            <ThumbsDown size={18} />
            <span>
              {dislikeCount >= 1000
                ? (dislikeCount / 1000).toFixed(1) + "K"
                : dislikeCount}
            </span>
          </button>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Comments */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">
            {comments.length} Comments
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-gray-800 text-white p-2 rounded"
              placeholder="Add a public comment..."
            />
            <button
              onClick={handlePostComment}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Comment
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <img
                  src={comment.owner.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-[#1a1a1a] p-3 rounded-lg w-full">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">
                      {comment.owner.username}
                    </p>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
