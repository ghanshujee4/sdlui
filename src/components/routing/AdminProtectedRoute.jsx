import { Navigate } from "react-router-dom";
import { STORAGE_KEYS } from "constants/storageKeys";
import { ROUTES } from "constants/routes";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.adminToken);
  const role = localStorage.getItem(STORAGE_KEYS.adminRole);

  if (!token || role !== "ADMIN") {
    return <Navigate to={ROUTES.adminLogin} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
