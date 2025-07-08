import { useState } from "react";
import { createPlaylist } from "../api/auth";
import { useNavigate } from "react-router-dom";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || videos.length === 0) {
      setError("All fields are required, including at least one video");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    for (let i = 0; i < videos.length; i++) {
      formData.append("videos", videos[i]);
    }

    try {
      await createPlaylist(formData);
      navigate("/dashboard/playlists");
    } catch (err) {
      console.error("Failed to create playlist", err);
      setError("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#1a1a2e] text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Playlist Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload Videos</label>
          <input
            type="file"
            onChange={handleVideoChange}
            multiple
            accept="video/*"
            className="w-full text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
        >
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
