import React, { useEffect, useState } from 'react';
import { getUserTweets } from '../../services/tweetServices';
import TweetCard from './TweetCard';

const GetAllTweets = ({ channelId }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllTweets = async () => {
      try {
        const res = await getUserTweets(channelId);
        console.log("all tweets", res?.data);
        setTweets(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching tweets:", err);
        setError("Failed to fetch tweets");
      }
    };

    if (channelId) fetchAllTweets();
  }, [channelId]);

  if (error) return <p className="text-red-500">{error}</p>;

  if (tweets.length === 0)
    return <p className="text-gray-400 text-sm">No tweets yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4 max-w-4xl w-full mx-auto px-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default GetAllTweets;
