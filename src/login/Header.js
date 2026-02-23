import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = () =>
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");

  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());

  // 🔁 Re-check auth on every route change
  useEffect(() => {
    setIsLoggedIn(checkAuth());
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage?.removeItem("token");
    localStorage?.removeItem("userId");
    localStorage?.removeItem("role");
    localStorage?.removeItem("adminToken");
    localStorage?.removeItem("adminRole");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header>
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="btn btn-danger pull-left"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary pull-left margin-left-10"
          >
            Login
          </button>
        )}

        <button
          className="btn btn-light pull-left margin-left-10"
          onClick={() => navigate("/")}
        >
          Register
        </button>

        <button
          className="btn btn-success pull-left margin-left-10"
          onClick={() => {
            const adminToken = localStorage.getItem("adminToken");
            const adminRole = localStorage.getItem("adminRole");
            if (adminToken && adminRole === "ADMIN") {
              navigate("/admindashboard");
            } else {
              navigate("/adminlogin");
            }
          }}
        >
          Admin
        </button>

       {isLoggedIn && <NotificationBell />}

      </div>
    </header>
  );
};

export default Header;
