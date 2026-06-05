import { STORAGE_KEYS } from "constants/storageKeys";

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
  localStorage?.removeItem(STORAGE_KEYS.studentToken);
  localStorage?.removeItem(STORAGE_KEYS.studentUserId);
  localStorage?.removeItem(STORAGE_KEYS.studentRole);
  localStorage?.removeItem(STORAGE_KEYS.adminToken);
  localStorage?.removeItem(STORAGE_KEYS.adminRole);
  // Sync logout across tabs
  window.dispatchEvent(new Event("storage"));

  // Redirect to login
  navigate("/login");
};
