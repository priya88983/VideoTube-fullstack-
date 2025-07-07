import React from "react";

const ProfileCard = ({ fullName, username, avatar }) => {
  return (
    <div className="flex items-center gap-3 bg-[#181818 ] p-2 rounded-lg hover:bg-[#2a2a2a] transition cursor-pointer">
      <img
        src={avatar || "/default-avatar.png"}
        alt={username}
        className="w-10 h-10 rounded-full object-cover border border-gray-600"
      />
      <div className="text-sm">
        <p className="text-white font-medium truncate">{fullName || "No Name"}</p>
        <p className="text-gray-400 text-xs">@{username}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
