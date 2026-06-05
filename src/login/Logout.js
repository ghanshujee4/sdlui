
export const logout = (navigate) => {
  // 🔐 JWT logout = remove token
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");

  // Sync logout across tabs
  window.dispatchEvent(new Event("storage"));

  // Redirect to login
  navigate("/login");
};

