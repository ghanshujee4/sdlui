import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import StudentNotificationBell from "./StudentNotificationBell";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const checkSessionMode = () => {
    if (localStorage.getItem("adminToken") && localStorage.getItem("adminRole") === "ADMIN") {
      return "ADMIN";
    }
    if (localStorage.getItem("token")) {
      return "USER";
    }
    return null;
  };

  const [sessionMode, setSessionMode] = useState(checkSessionMode());

  const syncSessionMode = () => setSessionMode(checkSessionMode());

  // 🔁 Re-check auth on every route change and storage event
  useEffect(() => {
    syncSessionMode();
    window.addEventListener("storage", syncSessionMode);
    return () => window.removeEventListener("storage", syncSessionMode);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage?.removeItem("token");
    localStorage?.removeItem("userId");
    localStorage?.removeItem("role");
    localStorage?.removeItem("adminToken");
    localStorage?.removeItem("adminRole");

    setSessionMode(null);
    navigate("/login");
  };

  const isLoggedIn = sessionMode !== null;

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

        {sessionMode === "ADMIN" && <NotificationBell />}
        {sessionMode === "USER" && <StudentNotificationBell />}

      </div>
    </header>
  );
};

export default Header;
