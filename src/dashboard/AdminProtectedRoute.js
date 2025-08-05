import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthorized(token && role === "admin");
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>; // Or a proper loader
  }

  return isAuthorized ? children : <Navigate to="/adminlogin" />;
};

export default AdminProtectedRoute;
