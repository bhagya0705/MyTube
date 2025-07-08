import { useState } from "react";
import { updateAvatar } from "../api/auth";
import toast from "react-hot-toast";

const UpdateAvatarForm = ({ onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateAvatar(formData);
      toast.success("Avatar updated successfully!");
      onSuccess();
    } catch (err) {
      toast.error("Failed to update avatar");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Update Avatar</h2>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upload Avatar
      </button>
    </form>
  );
};

export default UpdateAvatarForm;