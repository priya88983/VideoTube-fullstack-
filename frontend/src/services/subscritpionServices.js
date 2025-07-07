
import axiosInstance from "./axiosInstance";


export const toggleSubscription = async (channelId) => {
    const res = await axiosInstance.patch(`subscriptions/toggle/${channelId}`);
    return res.data;
};


export const getUserChannelSubscribers = async (channelId) => {
    const res = await axiosInstance.get(`subscriptions/subscribers/${channelId}`);
    return res.data;
};


export const getSubscribedChannels = async (channelId) => {
 

  const res = await axiosInstance.get(`subscriptions/subscribedto/${channelId}`);
  return res.data;
};


export const getSubscriptionStatus =async(channelId)=>{
  
 console.log("channelId being used in frontend:", channelId);
const res = await axiosInstance.get(`subscriptions/subscription-status/${channelId}`);

  return res.data;
}
