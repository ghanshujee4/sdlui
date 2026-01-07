import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAxios from "../login/adminAxios";
const AdminLogin = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("adminToken") !== null
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await adminAxios.post(
        `/users/admin/login`,
        formData
      );

      const { token, userId, role } = res.data;
      console.log("adminToken", token);
      console.log("adminUserId", userId);
      console.log("adminRole", role);
      if (token && role === "ADMIN") {
        // 🔐 Store ADMIN session
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUserId", userId);
        localStorage.setItem("adminRole", role);
        console.log("adminToken", token);
        console.log("adminUserId", userId);
        console.log("adminRole", role);

        setIsLoggedIn(true);
        navigate("/admindashboard");
      } else {
        setMessage("Unauthorized admin access");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setMessage("Admin login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content container">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">Admin Login</h4>

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              className="form-control mb-2"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Login
            </button>

            {message && (
              <p className="text-danger mt-2 text-center">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
