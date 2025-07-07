import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,  // ⬅️ important for cookies
});




export default axiosInstance;
