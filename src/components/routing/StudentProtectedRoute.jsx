import { Navigate, Outlet } from "react-router-dom";
import { STORAGE_KEYS } from "constants/storageKeys";
import { ROUTES } from "constants/routes";

/**
 * Guards admin-only routes that use the student JWT with role ADMIN.
 */
const StudentProtectedRoute = () => {
  const token = localStorage.getItem(STORAGE_KEYS.studentToken);
  const role = localStorage.getItem(STORAGE_KEYS.studentRole);

  if (!token) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default StudentProtectedRoute;
