import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/authUtils";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout(navigate);
    localStorage.removeItem("token"); // Ensure token is removed
    localStorage.removeItem("userId"); // Remove any related user data
    localStorage.removeItem("role"); // Remove Role related user data
    setIsLoggedIn(false); // Ensure state updates immediately
    window.dispatchEvent(new Event("storage")); // Notify all tabs
  };
  const onLoginClick = () => {
    
    navigate("/login");

  }
  

  return (
    <header>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        ) : (
          <button onClick={onLoginClick} className="btn btn-primary btn-md active" aria-pressed="true">
            Login
          </button>
        )}
        <button className="btn btn-light margin-left-10" href="#" onClick={() => navigate("/")}>
          Register 
        </button>
        <button
          className="btn btn-info margin-left-10"
          onClick={() => {
            const role = localStorage.getItem("role"); // Get role from local storage
            if (role === "admin") {
              navigate("/admindashboard"); // Redirect to admin dashboard
            } else {
              navigate("/adminlogin"); // Redirect to login if not admin
            }
          }}
        >
          Admin
        </button>

      </div>
    </header>
  );
};

export default Header;