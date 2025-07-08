import { useState } from "react";
import { updateAccountDetails } from "../api/auth";
import toast from "react-hot-toast";

const UpdateAccountForm = ({ currentName, currentEmail, onSuccess }) => {
  const [name, setName] = useState(currentName || "");
  const [email, setEmail] = useState(currentEmail || "");

  const handleSubmit = async (e) => {
    console.log("Submit triggered");
    e.preventDefault();
    try {
      await updateAccountDetails({ fullName: name, email });
      toast.success("Account details updated!");
      onSuccess();
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        toast.error(error.response.data?.message || "Server error");
      } else if (error.request) {
        console.error("No Response from server:", error.request);
        toast.error("No response from server");
      } else {
        console.error("Error", error.message);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white">
      <h2 className="text-xl font-semibold">Update Account Details</h2>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1f2937] border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1f2937] border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </form>
  );
};

export default UpdateAccountForm;
