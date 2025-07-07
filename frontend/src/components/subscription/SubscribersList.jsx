// components/subscription/SubscribersList.jsx
import React, { useEffect, useState } from "react";
import { getUserChannelSubscribers } from "../../services/subscritpionServices";
import ProfileCard from "../../components/ProfileCard"; // ✅ make sure it's the correct path

const SubscribersList = ({ channelId }) => {
  
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await getUserChannelSubscribers(channelId);
        setSubscribers(data);
      } catch (err) {
        console.error("Error fetching subscribers:", err);
      }
    };

    fetchSubscribers();
  }, [channelId]);

  if (!subscribers.length) return <p className="text-gray-400">No subscribers yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {subscribers.map((user) => (
        <ProfileCard
          key={user._id}
          fullName={user.fullName}
          username={user.username}
          avatar={user.avatar}
        />
      ))}
    </div>
  );
};

export default SubscribersList;
