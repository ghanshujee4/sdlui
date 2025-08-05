import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config"; // Replace with your actual config file
// import "../assets/fonts/fontawesome/css/fontawesome-all.min.css";
import "../assets/plugins/animation/css/animate.min.css";
import "../assets/css/style.css";
import AdminDashboard from '../dashboard/AdminDashboard';

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Check login status on component mount
  useEffect(() => {
    
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);  // Check if the token exists
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle form submit (login)
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${config.BASE_URL}/users/admin/login`, formData)
      .then((response) => {
        const { token, userId, role } = response.data;

        if (token && userId) {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("role", role); // S
          setIsLoggedIn(true);
          window.dispatchEvent(new Event("storage")); // Notify all tabs about login
          navigate("/admindashboard"); // Redirect after successful login
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage("Login failed. Please try again.");
      });
  };

  return isLoggedIn ? (
    <AdminDashboard />
  ) : (
    <div className="auth-wrapper">
      <div className="auth-content container">
        <div className="card">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="card-body">
                <img src="../assets/images/logo-dark.png" alt="" className="img-fluid mb-4" />
                <h4 className="mb-3 f-w-400">Login into your account</h4>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="feather icon-mail"></i></span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email address"
                    id="email"
                    name="email"
                    value={formData.email} // Fixed this to use email field
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="feather icon-lock"></i></span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group text-left mt-2">
                  <div className="checkbox checkbox-primary d-inline">
                    <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" checked="" />
                    <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                  </div>
                </div>
                <button className="btn btn-primary mb-4" onClick={handleSubmit}>Login</button>
                <p className="mb-2 text-muted">Forgot password? <a href="auth-reset-password.html" className="f-w-400">Reset</a></p>
                <p className="mb-0 text-muted">Don’t have an account? <a href="auth-signup.html" className="f-w-400">Signup</a></p>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <img src="../assets/images/auth-bg.jpg" alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;// Placeholder for AdminLogin.js