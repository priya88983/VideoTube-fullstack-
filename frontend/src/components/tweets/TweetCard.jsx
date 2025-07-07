import React, { useState, useEffect } from 'react';
import moment from 'moment';
import TweetLike from "../../components/like/TweetLike.jsx";
import OwnerMenu from "../../components/OwnerMenu.jsx";
import { getCurrentUser } from "../../services/authServices.js";
import { updateTweet, deleteTweet } from "../../services/tweetServices";
import toast from "react-hot-toast";

const TweetCard = ({ tweet }) => {
  const { _id, content, createdAt, ownerInfo } = tweet;

  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = async () => {
    try {
      await updateTweet(_id, { content: editedContent });
      toast.success("Tweet updated!");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTweet(_id);
      toast.success("Tweet deleted!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const isOwner =
    currentUser?._id &&
    ownerInfo?._id &&
    String(currentUser._id) === String(ownerInfo._id);

  return (
    <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-4 shadow-md transition hover:shadow-lg relative">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={ownerInfo?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white">{ownerInfo?.fullName || "Unknown"}</p>
            <p className="text-sm text-gray-400">@{ownerInfo?.username || "anonymous"}</p>
          </div>
        </div>

        {isOwner && <OwnerMenu onEdit={handleEdit} onDelete={handleDelete} />}
      </div>

      {/* Tweet content */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="bg-gray-800 p-2 text-white rounded resize-none"
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-400 hover:text-red-400"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="text-sm text-blue-500 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-[15px] mb-4 text-white">
          {content}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-gray-400 text-sm mt-2">
        <p>{moment(createdAt).format("M/D/YYYY, h:mm A")}</p>
        <TweetLike tweetId={_id} />
      </div>
    </div>
  );
};

export default TweetCard;
