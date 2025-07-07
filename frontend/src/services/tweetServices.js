import axios from  "./axiosInstance"; // Adjust if your path is different

// 🐦 Create a tweet
export const createTweet = async (tweetData) => {
  return await axios.post("/tweets/create", tweetData);
};

// 👤 Get all tweets by the current logged-in user
export const getUserTweets = async (userId) => {
  return await axios.get(`/tweets/user/${userId}`);
};



// ✏️ Update a tweet
export const updateTweet = async (tweetId, updatedData) => {
  return await axios.patch(`/tweets/${tweetId}/update`, updatedData);
};

// 🗑️ Delete a tweet
export const deleteTweet = async (tweetId) => {
  return await axios.patch(`/tweets/${tweetId}/delete`);
};
