import { useEffect, useState } from "react";
import { getChannelProfile } from "../api/auth";
import toast from "react-hot-toast";

const ChannelProfileView = ({ username }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getChannelProfile(username);
        setProfile(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch channel profile");
        console.error(err);
      }
    };
    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (!profile) return <p className="text-sm">Loading profile...</p>;

  return (
    <div className="space-y-2">
      <img
        src={profile.coverImage}
        alt="Cover"
        className="w-full h-28 object-cover rounded-md"
      />
      <div className="flex items-center gap-3 mt-2">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-14 h-14 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{profile.fullName}</h3>
          <p className="text-gray-500">@{profile.username}</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        {profile.subscribersCount} Subscribers • Subscribed to{" "}
        {profile.subscribedToCount}
      </div>
      <div className="text-green-500 mt-1 text-sm">
        {profile.isSubscribed ? "You are subscribed" : "Not subscribed"}
      </div>
    </div>
  );
};

export default ChannelProfileView;