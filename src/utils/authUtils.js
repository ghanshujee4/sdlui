import axios from "axios";
import config from "../config";

// export const logout = async (navigate) => {
//   try {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");

//     await axiosInstance.get(`/users/logout`);
//     console.log("Logged out successfully");
//   } catch (error) {
//     console.error("Error logging out:", error);
//   } finally {
//     navigate("/login");
//   }
// };

export const logout = (navigate) => {
  // 🔐 JWT logout = remove token
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");

  // Sync logout across tabs
  window.dispatchEvent(new Event("storage"));

  // Redirect to login
  navigate("/login");
};
