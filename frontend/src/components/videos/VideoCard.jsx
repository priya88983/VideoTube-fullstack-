import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const { _id, title, thumbnail, ownerInfo, createdAt, updatedAt, views } = video || {};

  return (
    <div
      className="w-full bg-[#0f0f0f] rounded-xl overflow-hidden hover:scale-[1.02] hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/videos/${_id}/watch`)}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video bg-black">
        <img
          src={thumbnail ? `${thumbnail}?t=${new Date(updatedAt).getTime()}` : "/default-thumbnail.png"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="flex p-3 gap-3">
        <img
          src={ownerInfo?.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">
            {title || "Untitled Video"}
          </h3>
          <p className="text-gray-400 text-xs mt-1 truncate">
            {ownerInfo?.fullName || "Unknown"} • {views} views • {moment(createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
