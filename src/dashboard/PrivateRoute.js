import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("admin");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;