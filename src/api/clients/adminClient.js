import axios from "axios";
import config from "config";
import { STORAGE_KEYS } from "constants/storageKeys";
import { ROUTES } from "constants/routes";

const adminClient = axios.create({
  baseURL: config.BASE_URL,
});

adminClient.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.adminToken);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

adminClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem(STORAGE_KEYS.adminToken);
      localStorage.removeItem(STORAGE_KEYS.adminRole);
      window.location.href = ROUTES.adminLogin;
    }
    return Promise.reject(err);
  }
);

export default adminClient;
