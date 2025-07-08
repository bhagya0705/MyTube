import { useEffect, useState } from "react";
import { getUserPlaylists, createPlaylist, addVideoToPlaylist } from "../api/auth";

const SaveToPlaylistModal = ({ videoId, userId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });

  const fetchPlaylists = async () => {
    try {
      const res = await getUserPlaylists(userId);
      setPlaylists(res.data.data);
      // Pre-select playlists that already include this video
      const preselected = new Set(
        res.data.data.filter(p => p.videos.includes(videoId)).map(p => p._id)
      );
      setSelectedPlaylists(preselected);
    } catch (err) {
      console.error("Failed to load playlists", err);
    }
  };

  useEffect(() => {
    if (userId && videoId) fetchPlaylists();
  }, [videoId, userId]);

  const togglePlaylistSelection = async (playlistId, isChecked) => {
    try {
      if (isChecked) {
        await addVideoToPlaylist(playlistId, videoId);
        selectedPlaylists.add(playlistId);
      } else {
        // Implement remove endpoint if needed
        selectedPlaylists.delete(playlistId);
      }
      setSelectedPlaylists(new Set([...selectedPlaylists]));
    } catch (err) {
      console.error("Error updating playlist", err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newPlaylist.name,
        description: newPlaylist.description,
      };
      const res = await createPlaylist(payload);
      setNewPlaylist({ name: "", description: "" });
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (err) {
      console.error("Error creating playlist", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-lg font-bold mb-4">Save to Playlist</h2>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {playlists.map((playlist) => (
            <label key={playlist._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedPlaylists.has(playlist._id)}
                onChange={(e) =>
                  togglePlaylistSelection(playlist._id, e.target.checked)
                }
              />
              <span>{playlist.name}</span>
            </label>
          ))}
        </div>

        <button
          className="mt-4 text-blue-400 hover:underline"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          + New Playlist
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreatePlaylist} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylist.name}
              onChange={(e) =>
                setNewPlaylist({ ...newPlaylist, name: e.target.value })
              }
              required
              className="w-full p-2 rounded bg-gray-800"
            />
            <textarea
              placeholder="Description"
              value={newPlaylist.description}
              onChange={(e) =>
                setNewPlaylist({ ...newPlaylist, description: e.target.value })
              }
              required
              className="w-full p-2 rounded bg-gray-800"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Create & Add
            </button>
          </form>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;
