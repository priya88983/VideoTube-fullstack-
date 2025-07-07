import React, { useEffect, useState } from "react";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscriptionStatus,
} from "../../services/subscritpionServices.js";

import { getCurrentUser } from "../../services/authServices.js";

const SubscribeButton = ({ channelId }) => {

  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error("❌ Error fetching current user:", err);
      }
    };

    fetchUser();
  }, []);

  

  useEffect(() => {
    const fetchStatus = async () => {
      try {
       

        console.log("channel id: ",channelId);
        const res = await getSubscriptionStatus(channelId);

        console.log("subscription Res: ",res);

       setIsSubscribed(res.data.isSubscribed);
      } catch (err) {
        console.error(" Error fetching Subscription status:", err);
      }
    };

    fetchStatus();
  }, [channelId]);

    console.log("channel is subscribed : ",isSubscribed);
  
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await toggleSubscription(channelId);
      setIsSubscribed((prev) => !prev);
    } catch (err) {
      console.error(" Error toggling subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 4: Hide button for self
  if (!user || user._id === channelId) return null;

  // ✅ Step 5: Render button
  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-semibold text-sm transition duration-200 shadow-md ${
        isSubscribed
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "bg-blue-600 text-white hover:bg-blue-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
