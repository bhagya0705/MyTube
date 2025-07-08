import { useEffect, useState } from "react";
import { getUserPlaylists, createPlaylist, deletePlaylist } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyPlaylists() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [refresh, setRefresh] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
  });

  const fetchPlaylists = async () => {
    try {
      const res = await getUserPlaylists(user._id);
      console.log(res);
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  };

  const handleDelete = async(playlistId)=>{
      if (!window.confirm("Are you sure you want to delete this playlist?")) return;
      try{
        await deletePlaylist(playlistId);
        setPlaylists((prev)=> prev.filter(playlist => playlist._id!==playlistId))
      }catch(err){
        console.error("Failed to delete the playlist",err);
        toast.error("Deletion failed. Please try again.");
      }
    }

  useEffect(() => {
    fetchPlaylists();
  }, [refresh]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newPlaylist.name,
        description: newPlaylist.description,
      };

      await createPlaylist(payload);
      setShowCreateModal(false);
      setNewPlaylist({ name: "", description: "" });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error creating playlist", err);
    }
  };

  const togglePlaylist = (playlistId) => {
    setSelectedPlaylistId((prev) => (prev === playlistId ? null : playlistId));
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Playlists</h2>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className=" relative bg-[#1a1a1a] p-4 rounded shadow hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => togglePlaylist(playlist._id)}
          >
            <h3 className="text-lg font-semibold mb-1">{playlist.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{playlist.description}</p>
            <p className="text-xs text-gray-500 mb-2">
              {playlist.videos.length} video(s)
            </p>
            <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(playlist._id);
                  }}
                  className="absolute right-2 bottom-3 text-red-600 hover:text-red-800"
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

            {selectedPlaylistId === playlist._id && (
              <div className="space-y-2 mt-3">
                {playlist.videos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-[#2a2a2a] p-2 rounded flex gap-3 items-center hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate(`/watch/${video._id}`)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <p className="text-white text-sm font-semibold">
                        {video.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {video.owner?.fullName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2e] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylist.name}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, name: e.target.value })
                }
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <textarea
                placeholder="Description"
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    description: e.target.value,
                  })
                }
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
