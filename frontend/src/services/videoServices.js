import axios from "./axiosInstance"; 


export const getAllVideos = async () => {
  const res = await axios.get("videos/all-videos");
  return res.data;
};


export const publishVideo = async (formData) => {
  const res = await axios.post("videos/publish-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // ✅ Needed to send auth cookies
  });
  return res.data;
};

export const watchVideo = async (videoId) => {
  const res = await axios.patch(`videos/${videoId}/watch`);
  return res.data;
};

export const getVideoByID = async (videoId) => {
  const res = await axios.get(`videos/${videoId}`);
  return res.data;
};

export const updateVideo = async (videoId, formData) => {

  // console.log("the form data is: ",formData);
  // console.log("videoId from videoservice: ", videoId);


  const res = await axios.patch(`videos/${videoId}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteVideo = async (videoId) => {
  const res = await axios.patch(`videos/${videoId}/delete`);
  return res.data;
};

export const togglePublish = async (videoId) => {
  const res = await axios.patch(`videos/${videoId}/toggle`); 
  return res.data;
};

export const getVideosByUser =async(Id)=>{
  const res = await axios.get(`videos/${Id}/getVideos`)
  return res.data;
}

