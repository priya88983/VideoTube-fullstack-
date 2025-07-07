import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchHistory } from "../../services/authServices";
import VideoCard from "../../components/videos/VideoCard";

const Watch_history = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getWatchHistory();
        console.log("watch history: ", res);
        setVideos(res.data || []);
      } catch (err) {
        console.error("Error fetching watch history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (<div className="bg-[#0f0f0f] text-white min-h-screen px-6 py-10 mx-4 sm:mx-8 lg:mx-16 xl:mx-24">
  <h2 className="text-3xl font-bold mb-8">Your Watch History</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {videos.length === 0 ? (
      <p className="text-gray-400 text-center col-span-full">
        You haven’t watched any videos yet.
      </p>
    ) : (
      videos.map((video) => (
        <VideoCard
          key={video._id}
          video={{ ...video, ownerInfo: video.owner }}
        />
      ))
    )}
  </div>
</div>
);
};

export default Watch_history;
