import axios from "axios";
import config from "../config";

export const logout = async (navigate) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    await axios.get(`${config.BASE_URL}/users/logout`);
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    navigate("/login");
  }
};
