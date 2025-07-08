import { useEffect, useState } from "react";
import { removeFromWatchHistory, watchHistory } from "../api/auth";
import WatchHistoryCard from "../components/WatchHistoryCard";
import { deleteVideoById } from "../api/auth";

const WatchHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await watchHistory();
        console.log(res);
        setHistory(res.data.data); // ✅ correct
      } catch (error) {
        console.error("Failed to fetch watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (videoId) => {
      if (!window.confirm("Are you sure you want to delete this video?")) return;
  
      try {
        await removeFromWatchHistory(videoId);
        setHistory((prev) => prev.filter((video) => video._id !== videoId));
      } catch (err) {
        console.error("Failed to delete video", err);
        alert("Something went wrong while deleting.");
      }
    };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Watch History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No videos in your history yet.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-1 w-full">
          {history.map((video) => (
            <WatchHistoryCard video={video} onDelete ={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistoryPage;
