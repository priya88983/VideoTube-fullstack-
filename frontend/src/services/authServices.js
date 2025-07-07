import { useBeforeUnload } from "react-router-dom";
import axios from "./axiosInstance.js";

// REGISTER user (with files like avatar/coverImage)
export const registerUser = async (formData) => {
    const res = await axios.post('users/register', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

//  LOGIN user

export const loginUser = async (data) => {
  const res = await axios.post('/users/login', data, { withCredentials: true });
  return res.data;
};


//  GET current logged-in user
export const getCurrentUser = async () => {

  const res = await axios.get('/users/current-user', { withCredentials: true });
  return res.data?.data; // 👈 only return actual user object
};

//  LOGOUT user
export const logoutUser = async () => {
    const res = await axios.post('/users/logout',{},{ withCredentials: true});
    return res.data;
};

//  REFRESH access token
export const refreshAccessToken = async () => {
  const res = await axios.post(
    '/users/refresh-token',
    {},                        // empty body
    { withCredentials: true }  // ✅ pass credentials in config
  );
  return res.data;
};


//  CHANGE current password
export const ChangePassword = async (data) => {
    const res = await axios.post('/users/change-password', data,{ withCredentials: true});
    return res.data;
};

//  UPDATE account details (like username, email etc.)
export const updateAccount = async (data) => {
    const res = await axios.patch('/users/update-account', data,{ withCredentials: true});
    return res.data;
};

//  UPDATE user avatar
export const updateAvatar = async (formData) => {
    const res = await axios.patch('/users/avatar', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

// UPDATE user cover image
export const updateCoverImage = async (formData) => {
    const res = await axios.patch('/users/cover-image', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

//  GET another user's channel profile
export const getUserChannelProfile = async (username) => {
    console.log(username)
    const res = await axios.get(`/users/c/${username}`);
    return res.data;
};

//  GET logged-in user's watch history
export const getWatchHistory = async () => {
    const res = await axios.get('/users/history');
    return res.data;
};
