// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { getAllVideos } from "../../services/videoServices.js";
import VideoCard from "./VideoCard.jsx";

const GetAllVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getAllVideos();
        console.log(" Videos from backend:", res?.data);
        setVideos(res?.data || []);
      } catch (error) {
        console.error("Failed to fetch videos", error.message);
      }
    };

    fetchVideos();
  }, []);

  return (
<div className="px-4 py-8 max-w-6xl mx-auto bg-[#0f0f0f]">
  <h2 className="text-3xl font-semibold mb-6 text-white">Latest Videos</h2>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {videos.map((video) => (
      <VideoCard key={video._id} video={video} />
    ))}
  </div>
</div>




  );
};

export default GetAllVideos ;
