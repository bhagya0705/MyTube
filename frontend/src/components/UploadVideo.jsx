import { useState } from "react";
import { uploadVideo } from "../api/auth";
import toast from "react-hot-toast";

const UploadVideoForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    videoFile: null,
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Uploading video...");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    try {
      await uploadVideo(formData);
      toast.success("Video uploaded successfully!");
      onSuccess();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6 py-6 bg-[#111827] rounded-xl shadow text-white"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          className="bg-[#1f2937] border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none w-full"
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration in seconds (e.g. 120)"
          onChange={handleChange}
          required
          className="bg-[#1f2937] border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none w-full"
        />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required
        className="bg-[#1f2937] border border-gray-600 px-4 py-2 rounded w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Upload Video
          </label>
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleChange}
            required
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Upload Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>

      {message && (
        <div className="text-sm text-blue-400 font-medium">{message}</div>
      )}

      <div className="flex justify-start">
        <button
          type="submit"
          className={`px-6 py-2 rounded text-white transition text-sm sm:text-base ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </form>
  );
};

export default UploadVideoForm;
