import { useEffect, useState } from "react";
import { getAllVideos, deleteVideoById, updateVideoById } from "../api/auth";
import UploadVideoForm from "./UploadVideo";
import toast from "react-hot-toast";

const MyVideosSection = ({ userId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [hoverVideoId, setHoverVideoId] = useState(null);
  const [clickedVideoId, setClickedVideoId] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [updateForm, setUpdateForm] = useState({ title: "", description: "" });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getAllVideos({ userId });
      setVideos(res.data.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await deleteVideoById(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
    } catch (err) {
      console.error("Failed to delete video", err);
      alert("Something went wrong while deleting.");
    }
  };

  const handleUpdateClick = (video) => {
    setEditingVideo(video);
    setUpdateForm({ title: video.title, description: video.description });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVideoById(editingVideo._id, updateForm);
      toast.success("Video updated successfully!");
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update video. Please try again.");
      alert("Failed to update video");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchVideos();
    }
  }, [userId]);

  const togglePlayback = (videoId) => {
    setPlayingVideoId((prevId) => (prevId === videoId ? null : videoId));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Uploaded Videos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? "Back to Videos" : "Upload New Video"}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm ? (
        <UploadVideoForm
          onSuccess={() => {
            setShowUploadForm(false);
            fetchVideos();
          }}
        />
      ) : loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gradient-to-br from-[#1a1a1d] to-[#0e0e11]/90 backdrop-blur-xl 
             border border-white/10 shadow-xl hover:shadow-blue-600 rounded-3xl 
             transition-all duration-300 transform hover:scale-[1.015] cursor-pointer group p-4"
              onMouseEnter={() => setHoverVideoId(video._id)}
              onMouseLeave={() => setHoverVideoId(null)}
              onClick={() =>
                setClickedVideoId((prev) =>
                  prev === video._id ? null : video._id
                )
              }
            >
              {clickedVideoId === video._id ? (
                <video
                  src={video.videoFile}
                  className="w-full h-40 object-cover rounded mb-2"
                  controls
                  autoPlay
                />
              ) : hoverVideoId === video._id ? (
                <video
                  src={video.videoFile}
                  className="w-full h-40 object-cover rounded mb-2"
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              <h3 className="font-medium text-blue-800 ">{video.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {video.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">{video.duration} sec</p>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateClick(video);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️ Update
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(video._id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="red"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update Video</h2>
            <form onSubmit={handleUpdateSubmit}>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={updateForm.title}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, title: e.target.value })
                }
                className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded mb-2"
              />
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                placeholder="Description"
                value={updateForm.description}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, description: e.target.value })
                }
                className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVideosSection;
