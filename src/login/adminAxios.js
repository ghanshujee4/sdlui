// import axios from "axios";
// import config from "../config";

// const adminAxios =axiosInstance.create({
//   baseURL: config.BASE_URL, // http://localhost:8080/api
// });

// // 🔐 Attach ADMIN JWT
// adminAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("adminToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🚪 Handle expired admin session safely
// adminAxios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err.response?.status;
//     const token = localStorage.getItem("adminToken");

//     if ((status === 401 || status === 403) && token) {
//       localStorage.clear();
//       window.location.href = "/adminlogin";
//     }

//     return Promise.reject(err);
//   }
// );

// export default adminAxios;


import axios from "axios";
import config from "../config";

const adminAxios = axios.create({
  baseURL: config.BASE_URL, // http://localhost:8080/api
});

// 🔐 Attach ADMIN JWT (ONLY ONCE)
adminAxios.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// 🚪 DO NOT FORCE REDIRECT HERE
adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      window.location.href = "/adminlogin";
    }
    return Promise.reject(err);
  }
);

export default adminAxios;
