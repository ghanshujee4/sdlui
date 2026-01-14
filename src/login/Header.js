import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/authUtils";
import NotificationBell from "./NotificationBell";
// import ChatLauncher from "../chat/ChatLauncher";
// import ChatBox from "../chat/ChatBox";

const Header = React.memo(() => {
  // const [showChatBox, setShowChatBox] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => 
    !!localStorage.getItem("token") || !!localStorage.getItem("adminToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token") || !!localStorage.getItem("adminToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = useCallback(() => {
    logout(navigate);
    localStorage.removeItem("token"); // Ensure token is removed
    localStorage.removeItem("userId"); // Remove any related user data
    localStorage.removeItem("role"); // Remove Role related user data
    localStorage.removeItem("adminToken"); // Ensure admin token is removed
    localStorage.removeItem("adminRole"); // Remove Role related user data
    setIsLoggedIn(false); // Ensure state updates immediately
    window.dispatchEvent(new Event("storage")); // Notify all tabs
  }, [navigate]);

  const onLoginClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleRegisterClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleAdminClick = useCallback(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole"); // Get role from local storage
    if (adminToken && adminRole === "ADMIN") {
      navigate("/admindashboard"); // Redirect to admin dashboard
    } else {
      navigate("/adminlogin"); // Redirect to login if not admin
    }
  }, [navigate]);
  

  return (
    <header>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-danger bg-danger pull-left margin-left-10">
            Logout
          </button>
        ) : (
          <button onClick={onLoginClick} className="btn btn-primary bg-primary btn-md active pull-left margin-left-10" aria-pressed="true">
            Login
          </button>
        )}
        
        <button className="btn card btn-light bg-light pull-left margin-left-10" onClick={handleRegisterClick}>
          Register 
        </button>
        <button
          className="btn bg-success bg-success pull-left margin-left-10"
          onClick={handleAdminClick}
        >
          Admin 
        </button>
        
        <NotificationBell />
        {/* <ChatLauncher onClick={() => setShowChatBox((v) => !v)} /> */}
        {/* {showChatBox && <ChatBox />} */}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;