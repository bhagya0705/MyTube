import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const WatchHistoryCard = ({ video, onDelete }) => {
  return (
    <div className="flex items-start gap-3 w-full p-2 mb-5 hover:bg-[#ffffff08] rounded-lg transition duration-200 group">
      {/* ✅ Link only around thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
          <PlayCircle className="text-white w-8 h-8" />
        </div>
      </Link>

      <div className="flex flex-col justify-center flex-grow overflow-hidden">
        <Link to={`/watch/${video._id}`}>
          <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
            {video.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-400 truncate">
          By {video.owner?.fullName}
        </p>
      </div>

      {/* ❌ Don't let button click trigger Link navigation */}
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent link click
          e.stopPropagation();
          onDelete(video._id);
        }}
        className="text-red-600 hover:text-red-800"
        title="Delete"
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
    </div>
  );
};

export default WatchHistoryCard;
