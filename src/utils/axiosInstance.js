import axios from "axios";
import config from "../config";

const axiosInstance =axios.create({
  baseURL: config.BASE_URL, // http://localhost:8080/api
});

// 🔐 Attach JWT automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚪 Handle expired session ONLY
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // localStorage.clear();
      // window.location.href = "/login";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
       window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
