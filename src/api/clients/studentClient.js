import axios from "axios";
import config from "config";
import { STORAGE_KEYS } from "constants/storageKeys";
import { ROUTES } from "constants/routes";

const studentClient = axios.create({
  baseURL: config.BASE_URL,
});

studentClient.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.studentToken);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

studentClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.studentToken);
      localStorage.removeItem(STORAGE_KEYS.studentUserId);
      localStorage.removeItem(STORAGE_KEYS.studentRole);
      window.location.href = ROUTES.login;
    }
    return Promise.reject(err);
  }
);

export default studentClient;
