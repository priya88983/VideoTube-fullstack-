import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoByID } from "../../services/videoServices.js";
import { formatDistanceToNow } from "date-fns";

const GetvideoByID = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getVideoByID(videoId);
        console.log("✅ Video fetched from backend:", res.data);
        setVideo(res.data);
      } catch (err) {
        console.error("❌ Error fetching video:", err);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (!video) return <p className="text-center mt-10 text-white">Loading...</p>;

  const { videoFile, title, description, thumbnail, views, createdAt, owner } = video;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-white">
      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video src={videoFile} controls className="w-full h-full object-contain" />
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold mb-2">{title}</h1>

      {/* Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-400 mb-4">
        <span>{views} views • {formatDistanceToNow(new Date(createdAt))} ago</span>
      </div>

      {/* Channel Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={owner?.avatar || "/default-avatar.png"}
          alt="Channel Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-white">{owner?.fullName || "Unknown Creator"}</p>
          <p className="text-xs text-gray-400">42k subscribers</p> {/* Dummy for now */}
        </div>
        <button className="ml-auto bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700">
          Subscribe
        </button>
      </div>

      {/* Description */}
      <div className="bg-[#1f1f1f] p-4 rounded-lg text-sm text-gray-300 whitespace-pre-line">
        {description || "No description provided."}
      </div>
    </div>
  );
};

export default GetvideoByID;
