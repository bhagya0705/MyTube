import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserPlaylists, addVideoToPlaylist, createPlaylist } from "../api/auth";
import {formatDistanceToNow} from "date-fns";
import toast from "react-hot-toast";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMenu, setShowMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });

  const fetchPlaylists = async () => {
    try {
      const res = await getUserPlaylists(user._id);
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addVideoToPlaylist(playlistId, video._id);
      toast.success("Video added to playlist!");
    } catch (err) {
      toast.error("Already in playlist or failed.");
      console.error(err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newPlaylist.name,
        description: newPlaylist.description,
      };
      await createPlaylist(payload);
      setNewPlaylist({ name: "", description: "" });
      setShowModal(false);
      fetchPlaylists(); // refresh
    } catch (err) {
      console.error("Create playlist failed", err);
    }
  };

  useEffect(() => {
    if (showMenu) fetchPlaylists();
  }, [showMenu]);

  return (
    <div className="relative">
      <div
        onClick={() => navigate(`/watch/${video._id}`)}
        className="cursor-pointer rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#1e1e2f] to-[#15151e] hover:shadow-xl transition-transform transform hover:scale-105"
      >
        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
        <div className="p-4">
  <h3 className="text-lg font-semibold text-white line-clamp-2">{video.title}</h3>
  <p className="text-sm text-[#AAAAAA]">{video.owner.fullName}</p>
  <p className="text-sm text-[#AAAAAA]">
    {video.views} views •{" "}
    {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
  </p>
</div>
      </div>

      {/* Three Dot Menu */}
      <div className="absolute top-2 right-2 z-10">
        <button
          className="text-white bg-gray-800 rounded-full px-2 py-1 hover:bg-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-60 bg-[#1e1e2e] border border-gray-700 rounded-lg shadow-lg z-50 p-2">
            <p className="text-white font-semibold px-2">Save to Playlist</p>
            {playlists.map((pl) => (
              <button
                key={pl._id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPlaylist(pl._id);
                }}
                className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded"
              >
                {pl.name}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
                setShowMenu(false);
              }}
              className="w-full text-left text-blue-400 hover:underline px-2 py-1 mt-2"
            >
              + Create New Playlist
            </button>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#1e1e2e] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Create Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <textarea
                placeholder="Description"
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, description: e.target.value })
                }
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;