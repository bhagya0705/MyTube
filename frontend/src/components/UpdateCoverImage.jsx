import { useState } from "react";
import { updateCoverImage } from "../api/auth";
import toast from "react-hot-toast";

const UpdateCoverImage = ({ onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      await updateCoverImage(formData);
      toast.success("Cover image updated!");
      onSuccess(); // refetch user
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cover image");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Select Cover Image</span>
        <input type="file" accept="image/*" onChange={handleChange} className="mt-1 block w-full" />
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upload
      </button>
    </form>
  );
};

export default UpdateCoverImage;