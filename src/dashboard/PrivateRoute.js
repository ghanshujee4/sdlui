import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("admin");
//   return token ? <Outlet /> : <Navigate to="/" />;
// };

// export default PrivateRoute;

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default PrivateRoute;