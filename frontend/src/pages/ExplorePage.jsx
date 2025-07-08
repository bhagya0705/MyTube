import { useEffect, useState } from "react";
import { getAllVideos } from "../api/auth";
import VideoCard from "../components/VideoCard";

const ExploreSection = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllVideos(); // it supports all videos
        setVideos(res.data.data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default ExploreSection;

