import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserChannelProfile } from "../services/authServices";
import SubscribeButton from "../components/subscription/SubscribeButton";
import {
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../services/subscritpionServices.js";
import SubscribedChannelsList from "../components/subscription/SubscribedChannelsList";
import { getVideosByUser } from "../services/videoServices.js";
import VideoCard from "../components/videos/VideoCard.jsx";
import SettingsButton from "./SettingsButton.jsx";
import GetAllTweets from "./tweets/GetAllTweets.jsx";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const { username } = useParams();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const handleProfileData = (data) => {
    setProfile(data);
    setSubscribersCount(data.subscribersCount || 0);
  };

  const fetchProfile = async () => {
    if (!authStatus) {
      navigate("/login");
      return;
    }
    try {
      const data = await getUserChannelProfile(username);
      handleProfileData(data.data);
    } catch (error) {
      setError(true);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await getUserChannelSubscribers(profile._id);
      const subs = Array.isArray(response?.data) ? response.data : [];
      setSubscribers(subs);
      setSubscribersCount(subs.length);
    } catch (error) {}
  };

  const fetchSubscribedChannels = async () => {
    try {
      const response = await getSubscribedChannels(profile._id);
      setSubscribedChannels(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {}
  };

  const fetchVideos = async () => {
    try {
      const response = await getVideosByUser(profile._id);
      setVideos(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate, authStatus, username]);

  useEffect(() => {
    if (!profile?._id) return;
    if (activeTab === "Subscribers") fetchSubscribers();
    if (activeTab === "Channels Subscribed") fetchSubscribedChannels();
    if (activeTab === "Videos") fetchVideos();
  }, [activeTab, profile?._id]);

  if (error) return <p className="text-center mt-10 text-red-500">User not found.</p>;
  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-black text-white min-h-screen">
      <div
        className="w-full h-40 sm:h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile?.coverImage || "/default-cover.png"})` }}
      ></div>

      <div className="px-6 sm:px-12 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar || "/default-avatar.png"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-black object-cover shadow-lg"
              alt="avatar"
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              <p className="text-gray-400 text-sm">@{profile.username}</p>
              <p className="text-xs text-gray-400">
                {subscribersCount} subscribers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <SubscribeButton
              channelId={profile._id}
              onToggle={fetchSubscribers} // this will update count also
            />
            <SettingsButton channelId={profile._id} />
          </div>
        </div>
      </div>

      <div className="mt-6 border-b border-gray-700 px-6 sm:px-12">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {["Videos", "Subscribers", "Channels Subscribed", "Tweets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-sm sm:text-base ${
                activeTab === tab
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-12 py-6">
        {activeTab === "Videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.length === 0 ? (
              <p className="text-gray-400 text-sm text-center col-span-full py-4">No videos yet.</p>
            ) : (
              videos.map((video) => <VideoCard key={video._id} video={video} />)
            )}
          </div>
        )}

        {activeTab === "Subscribers" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {subscribers.length === 0 ? (
              <p className="text-gray-400 text-sm col-span-full text-center">No subscribers yet.</p>
            ) : (
              subscribers.map((user, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/c/${user.username}`)}
                  className="bg-[0f0f0f] rounded-lg p-4 flex flex-col items-center text-center shadow cursor-pointer border- hover:bg-gray-700 transition"
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <p className="text-white font-medium text-sm">{user.fullName}</p>
                  <p className="text-gray-400 text-xs">@{user.username}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Channels Subscribed" && (
          <SubscribedChannelsList channels={subscribedChannels} />
        )}

        {activeTab === "Tweets" && (
          <GetAllTweets channelId={profile._id} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
