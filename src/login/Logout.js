import axios from "axios";
import config from "../config";

// export const logout = (navigate) => {
//   axios
//     .get(`/users/logout`)
//     .then(() => {
//       console.log("Logged out successfully");
//     })
//     .catch((error) => {
//       console.error("Error logging out:", error);
//     })
//     .finally(() => {
//       // Always clear storage and redirect, even if logout API fails
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//       localStorage.removeItem("role");

//       window.dispatchEvent(new Event("storage")); // Sync logout across tabs
//       navigate("/login");
//     });
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

