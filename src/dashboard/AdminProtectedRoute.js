// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const AdminProtectedRoute = ({ children }) => {
//   const [isAuthorized, setIsAuthorized] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     const role = localStorage.getItem("adminRole");
//     setIsAuthorized(token && role === "admin");
//   }, []);

//   if (isAuthorized === null) {
//     return <div>Loading...</div>; // Or a proper loader
//   }

//   return isAuthorized ? children : <Navigate to="/adminlogin" />;
// };

// export default AdminProtectedRoute;

import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (!token || role !== "ADMIN") {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
